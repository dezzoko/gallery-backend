import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MailingService } from './mailing.service';
import RequestWithUser from 'src/common/interfaces/request-with-user';

@Controller('mailing')
export class MailingController {
  constructor(readonly mailingService: MailingService) {}
  @Get('confirm-email')
  public async sendMail(@Param('token') token: string) {
    const email = await this.mailingService.decodeConfirmationToken(token);
  }

  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.mailingService.resendConfirmationLink(request.user.id);
  }
}
