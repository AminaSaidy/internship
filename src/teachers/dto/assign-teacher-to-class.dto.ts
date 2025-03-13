import { IsInt } from "class-validator";

export class AssignTeacherToClassDto {
  @IsInt()
  class_id: number;

  @IsInt()
  teacher_id: number;
}
