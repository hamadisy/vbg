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
import { ViolenceCategory } from '../entity/violence-category.entity';
import { ViolenceCategoriesService } from '../control/violence-categories.service';
import { CreateViolenceCategoryDto } from './dto/create-violence-category.dto';
import { UpdateViolenceCategoryDto } from './dto/update-violence-category.dto';
import { QueryViolenceCategoriesDto } from './dto/query-violence-categories.dto';
import { ViolenceCategoryResponseDto } from './dto/violence-category-response.dto';

// GET routes are open to any authenticated role (needed for the New Case
// pictogram picker); only mutations are Admin-only.
@ApiTags('violence-categories')
@ApiBearerAuth()
@Controller('violence-categories')
export class ViolenceCategoriesController {
  constructor(private readonly violenceCategoriesService: ViolenceCategoriesService) {}

  @Roles(Role.Administrator)
  @Post()
  async create(@Body() dto: CreateViolenceCategoryDto): Promise<ViolenceCategoryResponseDto> {
    const created = await this.violenceCategoriesService.create(dto);
    return this.toResponse(created);
  }

  @Get()
  async findAll(
    @Query() query: QueryViolenceCategoriesDto,
  ): Promise<ViolenceCategoryResponseDto[]> {
    const categories = await this.violenceCategoriesService.findAll(query.includeInactive ?? false);
    return categories.map((category) => this.toResponse(category));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ViolenceCategoryResponseDto> {
    const category = await this.violenceCategoriesService.findById(id);
    return this.toResponse(category);
  }

  @Roles(Role.Administrator)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateViolenceCategoryDto,
  ): Promise<ViolenceCategoryResponseDto> {
    const updated = await this.violenceCategoriesService.update(id, dto);
    return this.toResponse(updated);
  }

  @Roles(Role.Administrator)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.violenceCategoriesService.deactivate(id);
  }

  private toResponse(entity: ViolenceCategory): ViolenceCategoryResponseDto {
    return plainToInstance(ViolenceCategoryResponseDto, entity, { excludeExtraneousValues: true });
  }
}
