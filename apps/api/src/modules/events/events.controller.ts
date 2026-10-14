import {
  Body,
  BadRequestException,
  Delete,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateDraftEventDto } from './dto/update-draft-event.dto';
import type { EventCoverFile } from './event-cover-file';
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

  @Post('admin/cover')
  @UseGuards(AdminSupabaseGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
        callback(new BadRequestException('Formato no admitido. Solo se permiten imágenes JPG, PNG o WebP.'), false);
        return;
      }
      callback(null, true);
    },
  }))
  async uploadEventCover(
    @UploadedFile() file: EventCoverFile | undefined,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    if (!file) {
      throw new BadRequestException('Selecciona una portada de hasta 5 MB.');
    }
    const imageUrl = await this.eventsService.uploadEventCover(
      file,
      admin.id,
      admin.supabase,
    );
    return { imageUrl };
  }

  @Delete('admin/cover')
  @UseGuards(AdminSupabaseGuard)
  async removeEventCover(
    @Query('imageUrl') imageUrl: string,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    await this.eventsService.removeEventCover(
      imageUrl,
      admin.id,
      admin.supabase,
    );
    return { removed: true };
  }

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
    @Param('id', new ParseUUIDPipe()) eventId: string,
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
