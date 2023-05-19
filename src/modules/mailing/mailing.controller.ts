import { Controller, Get, HttpStatus, Query, Req } from '@nestjs/common';
import { MailingService } from './mailing.service';
import RequestWithUser from 'src/common/interfaces/request-with-user';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mailing')
@Controller('mailing')
export class MailingController {
  constructor(readonly mailingService: MailingService) {}
  @Get('confirm-email')
  public async confirmMail(@Query('token') token: string) {
    const email = await this.mailingService.decodeConfirmationToken(token);
    await this.mailingService.verificateEmail(email);
    return HttpStatus.OK;
  }

  @Get('resend-confirmation-link')
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.mailingService.resendConfirmationLink(request.user.id);
    return HttpStatus.OK;
  }
}
