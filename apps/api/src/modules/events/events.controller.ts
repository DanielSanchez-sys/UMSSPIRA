import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateDraftEventDto } from './dto/update-draft-event.dto';
import {
  AdminSupabaseGuard,
  CurrentAdmin,
  type AuthenticatedAdmin,
} from '../../shared/guards/admin-supabase.guard';

@Controller('api/events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @UseGuards(AdminSupabaseGuard)
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.eventsService.createEvent(
      createEventDto,
      admin.id,
      admin.supabase,
    );
  }

  @Get('catalog')
  async getCatalog() {
    return this.eventsService.getCatalog();
  }

  @Get('admin')
  @UseGuards(AdminSupabaseGuard)
  async getAdminEvents(@CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.eventsService.getAdminEvents(admin.id, admin.supabase);
  }

  @Get('admin/event/:id')
  @UseGuards(AdminSupabaseGuard)
  async getAdminEvent(
    @Param('id') eventId: string,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.eventsService.getAdminEvent(
      eventId,
      admin.id,
      admin.supabase,
    );
  }

  @Get('admin/:id')
  @UseGuards(AdminSupabaseGuard)
  async getAdminDraft(
    @Param('id') eventId: string,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.eventsService.getAdminDraft(
      eventId,
      admin.id,
      admin.supabase,
    );
  }

  @Get(':id')
  async getEventById(
    @Param('id') eventId: string,
  ) {
    return this.eventsService.getEventById(eventId);
  }

  @Patch('admin/:id')
  @UseGuards(AdminSupabaseGuard)
  async updateAdminDraft(
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateDraftEventDto,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.eventsService.updateAdminDraft(
      eventId,
      updateEventDto,
      admin.id,
      admin.supabase,
    );
  }

  @Patch('admin/:id/publish')
  @UseGuards(AdminSupabaseGuard)
  async publishAdminDraft(
    @Param('id') eventId: string,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.eventsService.publishAdminDraft(
      eventId,
      admin.id,
      admin.supabase,
    );
  }
}
