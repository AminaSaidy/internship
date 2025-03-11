import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignClassToSubjectDto {
  @IsInt()
  @Type(() => Number)
  class_id: number;

  @IsInt()
  @Type(() => Number)
  subject_id: number;
}
