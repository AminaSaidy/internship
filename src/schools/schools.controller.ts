import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
    constructor(private readonly schoolsService: SchoolsService) {}

  @Get(':id')
  async getSchoolById(@Param('id', ParseIntPipe) id: number) {
    const school = await this.schoolsService.findById(id);
    if (!school) {
      throw new NotFoundException('School was not found');
    }
    return school;
  }
}
