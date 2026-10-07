import { Module } from '@nestjs/common';
import { MentorshipInterestsController } from './mentorship-interests.controller';
import { MentorshipInterestsService } from './mentorship-interests.service';
import { MentorshipController } from './mentorship.controller';
import { MentorshipService } from './mentorship.service';

@Module({
  controllers: [MentorshipController, MentorshipInterestsController],
  providers: [MentorshipService, MentorshipInterestsService],
  // MentorshipInterestsService se exporta para que el módulo de áreas use
  // removeInterestsByArea (regla 7 de HU-03).
  exports: [MentorshipService, MentorshipInterestsService],
})
export class MentorshipModule {}
