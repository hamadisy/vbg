import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { NotificationRecipient } from '../entity/notification-recipient.entity';
import { NotificationRecipientsService } from '../control/notification-recipients.service';
import { CreateNotificationRecipientDto } from './dto/create-notification-recipient.dto';
import { UpdateNotificationRecipientDto } from './dto/update-notification-recipient.dto';
import { QueryNotificationRecipientsDto } from './dto/query-notification-recipients.dto';
import { NotificationRecipientResponseDto } from './dto/notification-recipient-response.dto';

// Fully Admin-only (unlike other master data) - who gets notified isn't
// needed by relays/directors for their day-to-day work.
@ApiTags('notification-recipients')
@ApiBearerAuth()
@Roles(Role.Administrator)
@Controller('notification-recipients')
export class NotificationRecipientsController {
  constructor(private readonly notificationRecipientsService: NotificationRecipientsService) {}

  @Post()
  async create(
    @Body() dto: CreateNotificationRecipientDto,
  ): Promise<NotificationRecipientResponseDto> {
    const created = await this.notificationRecipientsService.create(dto);
    return this.toResponse(created);
  }

  @Get()
  async findAll(
    @Query() query: QueryNotificationRecipientsDto,
  ): Promise<NotificationRecipientResponseDto[]> {
    const recipients = await this.notificationRecipientsService.findAll(query);
    return recipients.map((recipient) => this.toResponse(recipient));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NotificationRecipientResponseDto> {
    const recipient = await this.notificationRecipientsService.findById(id);
    return this.toResponse(recipient);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotificationRecipientDto,
  ): Promise<NotificationRecipientResponseDto> {
    const updated = await this.notificationRecipientsService.update(id, dto);
    return this.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.notificationRecipientsService.deactivate(id);
  }

  private toResponse(entity: NotificationRecipient): NotificationRecipientResponseDto {
    return plainToInstance(NotificationRecipientResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
