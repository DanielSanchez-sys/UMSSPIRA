import { Module } from '@nestjs/common';
import { MentorshipEligibilityService } from './mentorship-eligibility.service';

@Module({
  providers: [MentorshipEligibilityService],
  exports: [MentorshipEligibilityService],
})
export class MentorshipModule {}