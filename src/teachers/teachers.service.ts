import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { ConfigService } from "@nestjs/config";
import { AssignTeacherToClassDto } from "./dto/assign-teacher-to-class.dto";
import { DatabaseService } from "../db/database.service";
import { RedisService } from "../redis/redis.service";
import { Paginator } from "../paginator";
import { ErrorHandler } from "../error-handler";

@Injectable()
export class TeachersService {
  private pool: Pool;

  constructor(
    private configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService
  ) {
    this.pool = this.databaseService.getPool();
  }

  async create(createTeacherDto: CreateTeacherDto) {
    const { name, birth_date, phone, email, hired_at } = createTeacherDto;
    try {
      const result = await this.pool.query(
        "INSERT INTO teachers (name, birth_date, phone, email, hired_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, birth_date, phone, email, hired_at]
      );
      return result.rows[0];
    } catch (error) {
      ErrorHandler.throwError("Error occurred while inserting teacher.");
    }
  }

  async getTeachers(page = 1, pageSize = 5) {
   return Paginator.paginate(this.pool, this.redisService, "teachers", page, pageSize);
  }

  async getTeacherById(id: number) {
    try {
      const cacheKey = `teahcer_with_id_${id}`;
      const cachedData = await this.redisService.get(cacheKey);

      if (cachedData) {
        console.log("Data from Redis");
        return JSON.parse(cachedData);
      }

      const result = await this.pool.query(
        "SELECT * FROM teachers WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        throw new Error("Teacher not found.");
      }

      const response = result.rows[0];
      await this.redisService.set(cacheKey, response, 84600);
      console.log("Data was loaded to Redis");

      return response;
    } catch (error) {
      ErrorHandler.throwError("Error occurred while retrieving teacher.");
    }
  }

  async findTeacherClasses(id: number) {
    const cacheKey = `classes_of_teacher_with_id_${id}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);

      if (cachedData) {
        console.log("Data from Redis");
        return JSON.parse(cachedData);
      }

      const result = await this.pool.query(
        `SELECT c.id, c.name, c.school_id, c.year 
             FROM classes c 
             JOIN class_teachers ct ON c.id = ct.class_id 
             WHERE ct.teacher_id = $1`,
        [id]
      );
      const response = result.rows;

      await this.redisService.set(cacheKey, response, 84600);
      console.log("Data was loaded to Redis");
      return response;
    } catch (error) {
      ErrorHandler.throwError("Error occurred while retrieving teacher classes.");
    }
  }

  async assignTeacherToClass(assignTeacherToClassDto: AssignTeacherToClassDto) {
    const { class_id, teacher_id } = assignTeacherToClassDto;
    try {
      const classCheck = await this.pool.query(
        "SELECT id FROM classes WHERE id = $1",
        [class_id]
      );
      const teacherCheck = await this.pool.query(
        "SELECT id FROM teachers WHERE id = $1",
        [teacher_id]
      );
      if (classCheck.rows.length === 0 || teacherCheck.rows.length === 0) {
        throw new Error("Class or teacher does not exist.");
      }
      const result = await this.pool.query(
        "INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2) RETURNING *",
        [class_id, teacher_id]
      );
      return result.rows[0];
    } catch (error) {
      ErrorHandler.throwError("Error occurred while assigning teacher to class.");
    }
  }
}
