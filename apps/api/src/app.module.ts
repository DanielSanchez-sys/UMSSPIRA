import { Module } from '@nestjs/common';
import { MentorshipModule } from './modules/mentorship/mentorship.module';

@Module({
  imports: [MentorshipModule], // Aquí irán CompaniesModule y JobPostingsModule
  providers: [],
})
export class AppModule {}
