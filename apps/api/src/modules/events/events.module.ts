import { Module } from '@nestjs/common';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AdminSupabaseGuard } from '../../shared/guards/admin-supabase.guard';

@Module({
  controllers: [
    EventsController,
  ],
  providers: [
    EventsService,
    AdminSupabaseGuard,
  ],
  exports: [
    EventsService,
  ],
})
export class EventsModule {}