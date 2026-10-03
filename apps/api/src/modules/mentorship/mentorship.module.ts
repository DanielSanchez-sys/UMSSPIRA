import { Module } from '@nestjs/common';
import { MentorshipEligibilityService } from './mentorship-eligibility.service';
import { MentorshipController } from './mentorship.controller';

@Module({
  controllers: [MentorshipController],
  providers: [MentorshipEligibilityService],
  exports: [MentorshipEligibilityService],
})
export class MentorshipModule {}