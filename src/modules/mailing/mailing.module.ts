import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [MailingController],
  providers: [MailingService, ConfigService],
  exports: [MailingService],
})
export class MailingModule {}
