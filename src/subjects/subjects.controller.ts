import { Controller, Post, Get, Param, Query, Body } from "@nestjs/common";
import { SubjectsService } from "./subjects.service";
import { CreateSubjectDto } from "./dto/create-subject.dto";

@Controller("api/subjects")
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  async getSubjects(@Query("page") page: number) {
    return this.subjectsService.getSubjects(page);
  }

  @Get(":id")
  async getSubjectById(@Param("id") id: number) {
    return this.subjectsService.getSubjectById(id);
  }

  @Get(":id/classes")
  async findClassesBySubject(@Param("id") id: number) {
    return this.subjectsService.findClassesBySubject(id);
  }

  @Post("/classes")
  async assignClassToSubject(
    @Body() body: { class_id: number; subject_id: number }
  ) {
    return this.subjectsService.assignClassToSubject(
      body.class_id,
      body.subject_id
    );
  }
}
