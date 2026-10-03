import { Controller, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MentorshipEligibilityService } from './mentorship-eligibility.service';
import { MentorEligibilityProfile } from './mentor-eligibility.types';

@Controller('mentorship')
export class MentorshipController {
    constructor(
        private readonly mentorshipEligibilityService: MentorshipEligibilityService,
    ) {}

    @Patch('deactivate/:userId')
    @HttpCode(HttpStatus.OK)
    deactivateMentor(
        @Param('userId') userId: string,
        @Body('profile') profile: MentorEligibilityProfile,
        @Body('reason') reason?: string,
    ) {
        return this.mentorshipEligibilityService.deactivateMentorRole(profile, {
            userId,
            reason,
        });
    }
}