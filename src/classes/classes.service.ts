import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateClassDto } from './dto/create-class.dto';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/db/database.service'; 

@Injectable()
export class ClassesService {
    private pool: Pool;

    constructor(private configService: ConfigService, 
      private readonly databaseService: DatabaseService) {
      this.pool = this.databaseService.getPool();
  }

  async create(createClassDto: CreateClassDto) {
      const { name, school_id, year } = createClassDto;
      try {

        let schoolCheck = await this.pool.query(
            "SELECT id FROM schools WHERE id = $1", 
            [school_id]
        );

        if(schoolCheck.rows.length === 0) {
            throw new BadRequestException('School does not exist.');
        }

          const result = await this.pool.query(
              'INSERT INTO classes (name, school_id, year) VALUES ($1, $2, $3) RETURNING *',
              [name, school_id, year]
          );
          return result.rows[0];
      } catch (error) {
          console.error(error);
          throw new Error('Error occurred while inserting classs.');
      }
  }

  async getClasses(page: number, pageSize: number) {
    if (page < 1) page = 1;

    try {
      const countResult = await this.pool.query('SELECT COUNT(*) FROM classes');
      const classesAmount = parseInt(countResult.rows[0].count);
      const pagesAmount = Math.ceil(classesAmount / pageSize);

      if (page > pagesAmount) {
        return { error: 'Page not found', status: 404 };
      }

      const offset = (page - 1) * pageSize;
      const result = await this.pool.query(
        'SELECT * FROM classes ORDER BY id LIMIT $1 OFFSET $2',
        [pageSize, offset],
      );

      return {
        classes: result.rows,
        currentPage: page,
        classesAmount,
        pagesAmount,
      };
    } catch (error) {
      console.error(error);
      return { message: 'Internal error', status: 500 };
    }
  }

  async getClassById(classId: number) {
    const result = await this.pool.query('SELECT * FROM classes WHERE id = $1', [
      classId,
    ]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Class was not found');
    }

    return result.rows[0];
  }

  async getTeachersByClass(classId: number) {
    const result = await this.pool.query(
      `SELECT t.id, t.name, t.birth_date, t.phone, t.email, t.hired_at
      FROM teachers t JOIN class_teachers ct ON t.id = ct.teacher_id
      WHERE ct.class_id = $1`,
      [classId],
    );

    return result.rows;
  }

  async getSubjectsByClass(classId: number) {
    const result = await this.pool.query(
      `SELECT s.id, s.name, s.description
      FROM subjects s JOIN class_subjects cs ON s.id = cs.subject_id
      WHERE cs.class_id = $1`,
      [classId],
    );

    return result.rows;
  }
}
