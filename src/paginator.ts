import { Pool } from "pg";
import { RedisService } from "./redis/redis.service";

export class Paginator {
  static async paginate(
    pool: Pool,
    redisService: RedisService,
    tableName: string,
    page: number,
    pageSize: number
  ) {
    if (page < 1) page = 1;

    try {
      const cacheKey = `${tableName}_list_page_${page}_size_${pageSize}`;
      const cachedData = await redisService.get(cacheKey);

      if (cachedData) {
        console.log("Data from Redis");
        return JSON.parse(cachedData);
      }

      const countResult = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
      const totalItems = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalItems / pageSize);

      if (page > totalPages) {
        return { error: "Page not found", status: 404 };
      }

      const offset = (page - 1) * pageSize;
      const result = await pool.query(
        `SELECT * FROM ${tableName} ORDER BY id LIMIT $1 OFFSET $2`,
        [pageSize, offset]
      );
      const response = {
        items: result.rows,
        currentPage: page,
        totalItems,
        totalPages,
      };

      await redisService.set(cacheKey, response, 86400);
      console.log("Data was loaded to Redis");

      return response;
    } catch (error) {
      console.error(error);
      return { message: "Internal error", status: 500 };
    }
  }
}
