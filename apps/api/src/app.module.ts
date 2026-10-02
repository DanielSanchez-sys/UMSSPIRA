import { Module } from '@nestjs/common';
import { MentorshipModule } from './modules/mentorship/mentorship.module';

@Module({
  imports: [MentorshipModule], // Aquí irán CompaniesModule y JobPostingsModule
  controllers: [],
  providers: [],
})
export class AppModule {}
