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
import { ReferralStructure } from '../entity/referral-structure.entity';
import { ReferralStructuresService } from '../control/referral-structures.service';
import { CreateReferralStructureDto } from './dto/create-referral-structure.dto';
import { UpdateReferralStructureDto } from './dto/update-referral-structure.dto';
import { QueryReferralStructuresDto } from './dto/query-referral-structures.dto';
import { ReferralStructureResponseDto } from './dto/referral-structure-response.dto';

// GET routes are open to any authenticated role (needed for the New Case
// referral picker); only mutations are Admin-only.
@ApiTags('referral-structures')
@ApiBearerAuth()
@Controller('referral-structures')
export class ReferralStructuresController {
  constructor(private readonly referralStructuresService: ReferralStructuresService) {}

  @Roles(Role.Administrator)
  @Post()
  async create(@Body() dto: CreateReferralStructureDto): Promise<ReferralStructureResponseDto> {
    const created = await this.referralStructuresService.create(dto);
    return this.toResponse(created);
  }

  @Get()
  async findAll(
    @Query() query: QueryReferralStructuresDto,
  ): Promise<ReferralStructureResponseDto[]> {
    const referralStructures = await this.referralStructuresService.findAll(query);
    return referralStructures.map((rs) => this.toResponse(rs));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ReferralStructureResponseDto> {
    const referralStructure = await this.referralStructuresService.findById(id);
    return this.toResponse(referralStructure);
  }

  @Roles(Role.Administrator)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReferralStructureDto,
  ): Promise<ReferralStructureResponseDto> {
    const updated = await this.referralStructuresService.update(id, dto);
    return this.toResponse(updated);
  }

  @Roles(Role.Administrator)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.referralStructuresService.deactivate(id);
  }

  private toResponse(entity: ReferralStructure): ReferralStructureResponseDto {
    return plainToInstance(ReferralStructureResponseDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
