import { Module } from '@nestjs/common';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}