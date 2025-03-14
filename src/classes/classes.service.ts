import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { Pool } from "pg";
import { CreateClassDto } from "./dto/create-class.dto";
import { DatabaseService } from "../db/database.service";
import { RedisService } from "../redis/redis.service";
import { Paginator } from "../paginator";
import { ErrorHandler } from "../error-handler";

@Injectable()
export class ClassesService {
  private pool: Pool;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService
  ) {
    this.pool = this.databaseService.getPool();
  }

  async create(createClassDto: CreateClassDto) {
    const { name, school_id, year } = createClassDto;
    try {
      let schoolCheck = await this.pool.query(
        "SELECT id FROM schools WHERE id = $1",
        [school_id]
      );

      if (schoolCheck.rows.length === 0) {
        throw new BadRequestException("School does not exist.");
      }

      const result = await this.pool.query(
        "INSERT INTO classes (name, school_id, year) VALUES ($1, $2, $3) RETURNING *",
        [name, school_id, year]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      ErrorHandler.throwError("Error occurred while inserting classs.");
    }
  }

  async getClasses(page: number, pageSize: number) {
   return Paginator.paginate(this.pool, this.redisService, "classes", page, pageSize);
  }

  async getClassById(classId: number) {
    const cacheKey = `class_wait_id_${classId}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log("Data from Redis");
      return JSON.parse(cachedData);
    }

    const result = await this.pool.query(
      "SELECT * FROM classes WHERE id = $1",
      [classId]
    );

    if (result.rows.length === 0) {
      ErrorHandler.throwError("Class was not found");
    }

    const response = result.rows[0];
    await this.redisService.set(cacheKey, response, 23200);
    console.log("Data is loaded to Redis");
    return response;
  }

  async getTeachersByClass(classId: number) {
    const cacheKey = `teachers_teaching_class_with_id_${classId}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log("Data from Redis");
      return JSON.parse(cachedData);
    }

    const result = await this.pool.query(
      `SELECT t.id, t.name, t.birth_date, t.phone, t.email, t.hired_at
      FROM teachers t JOIN class_teachers ct ON t.id = ct.teacher_id
      WHERE ct.class_id = $1`,
      [classId]
    );

    const response = result.rows;
    await this.redisService.set(cacheKey, response, 23200);
    console.log("Data is loaded to Redis");
    return response;
  }

  async getSubjectsByClass(classId: number) {
    const cacheKey = `subjects_learned_at_class_with_id_${classId}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log("Data from Redis");
      return JSON.parse(cachedData);
    }

    const result = await this.pool.query(
      `SELECT s.id, s.name, s.description
      FROM subjects s JOIN class_subjects cs ON s.id = cs.subject_id
      WHERE cs.class_id = $1`,
      [classId]
    );

    const response = result.rows;
    await this.redisService.set(cacheKey, response, 23200);
    console.log("Data is loaded to Redis");
    return response;
  }
}
