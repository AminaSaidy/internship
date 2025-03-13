import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  Body,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { Response } from "express";

@Controller("api/students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      return await this.studentsService.create(createStudentDto);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getStudents(@Query("page") page: string, @Res() res: Response) {
    const pageNumber = parseInt(page) || 1;
    const pageSize = 5;

    const result = await this.studentsService.getStudents(pageNumber, pageSize);

    if (result.error) {
      return res
        .status(result.status as number)
        .json({ message: result.error });
    }

    return res.json(result);
  }

  @Get(":id")
  async getStudentById(@Param("id", ParseIntPipe) id: number) {
    const student = await this.studentsService.findById(id);
    if (!student) {
      throw new NotFoundException("Student was not found");
    }
    return student;
  }
}
