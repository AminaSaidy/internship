import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { DatabaseService } from "../db/database.service";
import { RedisService } from "../redis/redis.service";
import { Paginator } from "../paginator";
import { ErrorHandler } from "../error-handler";

@Injectable()
export class SchoolsService {
  private pool: Pool;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService
  ) {
    this.pool = this.databaseService.getPool();
  }

  async getSchools(page: number, pageSize: number) {
    return Paginator.paginate(
      this.pool,
      this.redisService,
      "schools",
      page,
      pageSize
    );
  }

  async findById(id: number) {
    const cacheKey = `school_with_id_${id}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log("Data from Redis");
      return cachedData;
    }

    const result = await this.pool.query(
      "SELECT * FROM schools WHERE id = $1",
      [id]
    );
    const response = result.rows[0] || null;

    if (response) {
      await this.redisService.set(cacheKey, response, 86400);
      console.log("Data was loaded to Redis");
    }

    return response;
  }

  async create(createSchoolDto: CreateSchoolDto) {
    const { number, name, classesAmount, teachersAmount, status } =
      createSchoolDto;
    try {
      const result = await this.pool.query(
        "INSERT INTO schools (number, name, classes_amount, teachers_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [number, name, classesAmount, teachersAmount, status]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      ErrorHandler.throwError("Error occurred while inserting school.");
    }
  }
}
