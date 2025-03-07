import { IsNotEmpty, IsInt, IsDateString, IsString, Length } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  birth_date: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1) // M или F
  gender: string;

  @IsNotEmpty()
  @IsInt()
  class_id: number;

  @IsNotEmpty()
  @IsDateString()
  enrolled_at: string;
}
