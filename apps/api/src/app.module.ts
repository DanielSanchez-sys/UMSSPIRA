import { Module } from '@nestjs/common';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth';

@Module({
  imports: [
    MailModule,
    AuthModule, // CompaniesModule y JobPostingsModule se agregaran despues
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}