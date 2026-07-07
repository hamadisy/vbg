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
import { Region } from '../entity/region.entity';
import { RegionsService } from '../control/regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { QueryRegionsDto } from './dto/query-regions.dto';
import { RegionResponseDto } from './dto/region-response.dto';

// GET routes are open to any authenticated role (relays/directors need this
// list to fill in a case's location); only mutations are Admin-only.
@ApiTags('regions')
@ApiBearerAuth()
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Roles(Role.Administrator)
  @Post()
  async create(@Body() dto: CreateRegionDto): Promise<RegionResponseDto> {
    const created = await this.regionsService.create(dto);
    return this.toResponse(created);
  }

  @Get()
  async findAll(@Query() query: QueryRegionsDto): Promise<RegionResponseDto[]> {
    const regions = await this.regionsService.findAll(query.includeInactive ?? false);
    return regions.map((region) => this.toResponse(region));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RegionResponseDto> {
    const region = await this.regionsService.findById(id);
    return this.toResponse(region);
  }

  @Roles(Role.Administrator)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRegionDto,
  ): Promise<RegionResponseDto> {
    const updated = await this.regionsService.update(id, dto);
    return this.toResponse(updated);
  }

  @Roles(Role.Administrator)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.regionsService.deactivate(id);
  }

  private toResponse(entity: Region): RegionResponseDto {
    return plainToInstance(RegionResponseDto, entity, { excludeExtraneousValues: true });
  }
}
