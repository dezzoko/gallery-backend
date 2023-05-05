import {
  BadRequestException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { JwtService } from '@nestjs/jwt';
import { SendMailDto } from './dto/send-mail.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async verificateEmail(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new BadRequestException('There isnt such user');
    try {
      this.userService.addRoleToUser({
        userId: user.id,
        roleName: 'EMAIL_CONFIRMED',
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Something went wrong with email');
    }
  }
  public sendVerificationLink(email: string) {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: this.configService.get(
          'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
        ),
      },
    );

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    return this.sendMail({
      to: email,
      subject: 'Email confirmation',
      text: url,
    });
  }
  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
  public async resendConfirmationLink(userId: number) {
    const user = await this.userService.getById(userId);
    if (user.roles.includes('EMAIL_CONFIRMED')) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }

  public async confirmEmail(email: string) {
    const user = await this.userService.getByEmail(email);
    return user;
  }
  public async sendMail(sendMailDto: SendMailDto) {
    console.log(sendMailDto.text);

    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: sendMailDto.to,
        subject: sendMailDto.subject,
        template: 'action',
        context: {
          link: sendMailDto.text,
        },
      })
      .then((success) => {
        return HttpStatus.OK;
      })
      .catch((err) => {
        return new ForbiddenException(
          'somethin went wrong with sending mail' + err,
        );
      });
  }
}
