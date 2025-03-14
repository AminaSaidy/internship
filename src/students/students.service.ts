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
import { Paginator } from "../paginator";

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
    return Paginator.paginate(this.pool, this.redisService, "students", page, pageSize);
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
