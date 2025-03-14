import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { DatabaseService } from "../db/database.service";
import { RedisService } from "../redis/redis.service";
import { Paginator } from "../paginator";
import { ErrorHandler } from "../error-handler";

@Injectable()
export class SubjectsService {
  private pool: Pool;

  constructor(
    private configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService
  ) {
    this.pool = this.databaseService.getPool();
  }

  async create(createSubjectDto: CreateSubjectDto) {
    const { name, description } = createSubjectDto;

    if (!name || !description) {
      throw new BadRequestException("Some required fields are empty.");
    }

    try {
      const result = await this.pool.query(
        "INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
      );

      return result.rows[0];
    } catch (error) {
      console.error(error);
      ErrorHandler.throwError("Internal error occurred");
    }
  }

  async getSubjects(page = 1, pageSize = 5) {
    return Paginator.paginate(this.pool, this.redisService, "subjects", page, pageSize);
  }

  async getSubjectById(id: number) {
    try {
      const cacheKey = `subject_with_id_${id}`;
      const cachedData = await this.redisService.get(cacheKey);

      if (cachedData) {
        console.log("Data from redis");
        return JSON.parse(cachedData);
      }

      const result = await this.pool.query(
        "SELECT * FROM subjects WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        throw new NotFoundException("Subject was not found");
      }

      const response = result.rows[0];
      await this.redisService.set(cacheKey, response, 84600);
      console.log("Data was loaded to Redis");

      return response;
    } catch (error) {
      console.error(error);
      ErrorHandler.throwError("Internal error occurred");
    }
  }

  async findClassesBySubject(subjectId: number) {
    const cacheKey = `classes_learning_subject_with_id_${subjectId}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);

      if (cachedData) {
        console.log("Data from Redis");
        return JSON.parse(cachedData);
      }

      const result = await this.pool.query(
        `SELECT c.id, c.name, c.school_id, c.year 
                 FROM classes c 
                 JOIN class_subjects cs ON c.id = cs.class_id 
                 WHERE cs.subject_id = $1`,
        [subjectId]
      );

      const response = result.rows;
      await this.redisService.set(cacheKey, response, 84600);
      console.log("Data was loaded to Redis");
      return response;
    } catch (error) {
      console.error(error);
      ErrorHandler.throwError("Internal error occurred");
    }
  }

  async assignClassToSubject(classId: number, subjectId: number) {
    try {
      const classCheck = await this.pool.query(
        "SELECT id FROM classes WHERE id = $1",
        [classId]
      );
      const subjectCheck = await this.pool.query(
        "SELECT id FROM subjects WHERE id = $1",
        [subjectId]
      );

      if (classCheck.rows.length === 0 || subjectCheck.rows.length === 0) {
        throw new BadRequestException("Class or subject does not exist.");
      }

      const result = await this.pool.query(
        `INSERT INTO class_subjects (class_id, subject_id) VALUES ($1, $2) RETURNING *`,
        [classId, subjectId]
      );

      return result.rows[0];
    } catch (error) {
      console.error(error);
      ErrorHandler.throwError("Internal error occurred");
    }
  }
}
