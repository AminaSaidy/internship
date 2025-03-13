import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Query,
  Res,
  Post,
  Body,
  BadRequestException,
} from "@nestjs/common";

import { SchoolsService } from "./schools.service";
import { Response } from "express";
import { CreateSchoolDto } from "./dto/create-school.dto";

@Controller("api/school")
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async getSchools(@Query("page") page: string, @Res() res: Response) {
    const pageNumber = parseInt(page) || 1;
    const pageSize = 5;

    const result = await this.schoolsService.getSchools(pageNumber, pageSize);

    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.json(result);
  }

  @Get(":id")
  async getSchoolById(@Param("id", ParseIntPipe) id: number) {
    const school = await this.schoolsService.findById(id);
    if (!school) {
      throw new NotFoundException("School was not found");
    }
    return school;
  }

  @Post()
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    const { number, name, classesAmount, teachersAmount, status } =
      createSchoolDto;

    if (
      !number ||
      !name ||
      !classesAmount ||
      !teachersAmount ||
      status === undefined
    ) {
      throw new BadRequestException("Some required fields are empty.");
    }

    return this.schoolsService.create(createSchoolDto);
  }
}
