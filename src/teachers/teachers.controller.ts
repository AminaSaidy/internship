import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { AssignTeacherToClassDto } from './dto/assign-teacher-to-class.dto';

@Controller('api/teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) {}

    @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  async getTeachers(@Query('page') page: number) {
    if (page < 1) throw new BadRequestException('Page number must be greater than 0');
    return this.teachersService.getTeachers(page);
  }


  @Get(':id')
  async getTeacherById(@Param('id', ParseIntPipe) id: number) {
    const teacher = await this.teachersService.getTeacherById(id);
    if (!teacher) throw new NotFoundException('Teacher was not found');
    return teacher;
  }

  @Get(':id/classes')
  async findTeacherClasses(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.findTeacherClasses(id);
  }

  @Post('/classes')
  async assignTeacherToClass(@Body() assignTeacherToClassDto: AssignTeacherToClassDto) {
    return this.teachersService.assignTeacherToClass(assignTeacherToClassDto);
  }
}
