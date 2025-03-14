import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";
import { CreateStudentDto } from "./dto/create-student.dto";
import { DatabaseService } from "../db/database.service";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class StudentsService {
  private pool: Pool;

  constructor(
    private configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService
  ) {
    this.pool = this.databaseService.getPool();
  }

  async create(createStudentDto: CreateStudentDto) {
    const { name, birth_date, gender, class_id, enrolled_at } =
      createStudentDto;

    const classCheck = await this.pool.query(
      "SELECT id FROM classes WHERE id = $1",
      [class_id]
    );

    if (classCheck.rows.length === 0) {
      throw new BadRequestException("Class does not exist.");
    }

    const result = await this.pool.query(
      `INSERT INTO students (name, birth_date, gender, class_id, enrolled_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, birth_date, gender, class_id, enrolled_at]
    );

    return result.rows[0];
  }

  async getStudents(page: number, pageSize: number) {
    if (page < 1) page = 1;
    const cacheKey = `students_list_page_${page}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);

      if (cachedData) {
        console.log("Data from Redis");
        return JSON.parse(cachedData);
      }

      const countResult = await this.pool.query(
        "SELECT COUNT(*) FROM students"
      );
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

      const response = {
        students: result.rows,
        currentPage: page,
        studentsAmount,
        pagesAmount,
      };

      await this.redisService.set(cacheKey, JSON.stringify(response), 86400);
      console.log("Data was loaded to Redis");
      return response;
    } catch (error) {
      console.error(error);
      return { message: "Internal error", status: 500 };
    }
  }

  async findById(id: number) {
    const cacheKey = `student_with_id_${id}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log("Data from Redis");
      return JSON.parse(cachedData);
    }

    const result = await this.pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException("Student was not found.");
    }

    const response = result.rows;
    await this.redisService.set(cacheKey, response, 86400);
    console.log("Data was loaded to Redis");
    return response;
  }
}
