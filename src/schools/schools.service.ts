import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolsService {
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

  async getSchools(page: number, pageSize: number) {
    if(page < 1) page = 1;
    
    try {
        let countSchools = await this.pool.query("SELECT COUNT(*) FROM schools");
        let schoolsAmount = parseInt(countSchools.rows[0].count);
        let pagesAmount = Math.ceil(schoolsAmount/pageSize);

        if(page > pagesAmount) {
            return  { error: "Page not found", status: 404 };
        }

        //индексы школ, которые будут выведены на конкретной странице
        let startIndex = (page - 1) * pageSize;
        let result = await this.pool.query(
            "SELECT * FROM schools ORDER BY id LIMIT $1 OFFSET $2",
            [pageSize, startIndex]
        );

        return {
            schools: result.rows,
            currentPage: page,
            schoolsAmount,
            pagesAmount
        };
    } catch (error) {
    console.error(error);
    return { message: "Internal error", status: 500 };
    } 
}

  async findById(id: number) {
    const result = await this.pool.query('SELECT * FROM schools WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(createSchoolDto: CreateSchoolDto) {
    const { number, name, classesAmount, teachersAmount, status } = createSchoolDto;
    try {
        const result = await this.pool.query(
            'INSERT INTO schools (number, name, classes_amount, teachers_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [number, name, classesAmount, teachersAmount, status]
        );
        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error occurred while inserting school.');
    }
}
}
