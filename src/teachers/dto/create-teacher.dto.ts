import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsPhoneNumber,
  IsEmail,
} from "class-validator";

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  birth_date: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsDateString()
  hired_at: string;
}
