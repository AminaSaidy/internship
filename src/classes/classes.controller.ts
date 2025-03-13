import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { ClassesService } from "./classes.service";
import { CreateClassDto } from "./dto/create-class.dto";

@Controller("api/classes")
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async createClass(@Body() createClassDto: CreateClassDto) {
    const { name, school_id, year } = createClassDto;

    if (!name || !school_id || !year) {
      throw new BadRequestException("Some required fields are empty.");
    }

    return this.classesService.create(createClassDto);
  }

  @Get()
  async getClasses(@Query("page") page: string, @Res() res: Response) {
    const pageNumber = parseInt(page) || 1;
    const pageSize = 5;

    const result = await this.classesService.getClasses(pageNumber, pageSize);

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.json(result);
  }

  @Get(":id")
  async getClassById(@Param("id", ParseIntPipe) id: number) {
    return this.classesService.getClassById(id);
  }

  @Get(":id/teachers")
  async getTeachersByClass(@Param("id", ParseIntPipe) id: number) {
    return this.classesService.getTeachersByClass(id);
  }

  @Get(":id/subjects")
  async getSubjectsByClass(@Param("id", ParseIntPipe) id: number) {
    return this.classesService.getSubjectsByClass(id);
  }
}
