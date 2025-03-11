import { Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
    private pool: Pool;

  constructor(private configService: ConfigService) {
      this.pool = new Pool({
        user: this.configService.get<string>('DB_USER'),
        host: this.configService.get<string>('DB_HOST'),
        database: this.configService.get<string>('DB_NAME'),
        password: this.configService.get<string>('DB_PASSWORD'),
        port: this.configService.get<number>('DB_PORT'),
      });
    }

  async create(createStudentDto: CreateStudentDto) {
    const { name, birth_date, gender, class_id, enrolled_at } = createStudentDto;

    const classCheck = await this.pool.query(
      'SELECT id FROM classes WHERE id = $1',
      [class_id],
    );

    if (classCheck.rows.length === 0) {
      throw new BadRequestException('Class does not exist.');
    }

    const result = await this.pool.query(
      `INSERT INTO students (name, birth_date, gender, class_id, enrolled_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, birth_date, gender, class_id, enrolled_at],
    );

    return result.rows[0];
  }

  async getStudents(page: number, pageSize: number) {
    if (page < 1) page = 1;

    try {
      const countResult = await this.pool.query("SELECT COUNT(*) FROM students");
      const studentsAmount = parseInt(countResult.rows[0].count);
      const pagesAmount = Math.ceil(studentsAmount / pageSize);

      if (page > pagesAmount) {
        return { error: "Page not found", status: 404 };
      }

      const startIndex = (page - 1) * pageSize;
      const result = await this.pool.query(
        "SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2",
        [pageSize, startIndex]
      );

      return {
        students: result.rows,
        currentPage: page,
        studentsAmount,
        pagesAmount
      };
    } catch (error) {
      console.error(error);
      return { message: "Internal error", status: 500 };
    }
  }

  async findById (id: number) {
    const result = await this.pool.query(
      'SELECT * FROM students WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Student was not found.');
    }

    return result.rows[0];
  }
}
