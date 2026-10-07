import { Module } from '@nestjs/common';
import { MentorshipController } from './mentorship.controller';
import { MentorshipService } from './mentorship.service';
import { MentorTestAuthGuard } from './mentor-test-auth.guard';

@Module({
  controllers: [MentorshipController],
  providers: [MentorshipService, MentorTestAuthGuard],
  exports: [MentorshipService],
})
export class MentorshipModule {}
