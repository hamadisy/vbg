import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRegionRepository, REGION_REPOSITORY } from '../entity/region.repository.port';
import { Region } from '../entity/region.entity';
import { CreateRegionDto } from '../boundary/dto/create-region.dto';
import { UpdateRegionDto } from '../boundary/dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(@Inject(REGION_REPOSITORY) private readonly regions: IRegionRepository) {}

  create(dto: CreateRegionDto): Promise<Region> {
    return this.regions.create(dto);
  }

  findAll(includeInactive: boolean): Promise<Region[]> {
    return this.regions.findAllFiltered(includeInactive);
  }

  async findById(id: string): Promise<Region> {
    const region = await this.regions.findById(id);
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    return region;
  }

  async update(id: string, dto: UpdateRegionDto): Promise<Region> {
    await this.findById(id);
    return this.regions.update(id, dto);
  }

  async deactivate(id: string): Promise<void> {
    await this.findById(id);
    await this.regions.update(id, { isActive: false });
  }
}
