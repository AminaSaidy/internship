import { Injectable, Inject, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { CreateSubjectDto } from './dto/create-subject.dto'
import { DatabaseService } from 'src/db/database.service';

@Injectable()
export class SubjectsService {
    private pool: Pool;
    
    constructor(private configService: ConfigService, 
        private readonly databaseService: DatabaseService) {
        this.pool = this.databaseService.getPool();
    }

     async create(createSubjectDto: CreateSubjectDto) {
        const { name, description } = createSubjectDto;
        
        if (!name || !description) {
              throw new BadRequestException('Some required fields are empty.');
        }
        
        try {
              const result = await this.pool.query(
                'INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *',
                [name, description]
              );
        
              return result.rows[0];
        } catch (error) {
              console.error(error);
              throw new InternalServerErrorException('Internal error occurred');
        }
    }
        
    async getSubjects(page = 1, pageSize = 5) {
            if (page < 1) page = 1;
            const offset = (page - 1) * pageSize;
        
            try {
              const result = await this.pool.query(
                'SELECT * FROM subjects ORDER BY id LIMIT $1 OFFSET $2',
                [pageSize, offset]
              );
        
              const countSubjects = await this.pool.query('SELECT COUNT(*) FROM subjects');
              const subjectsAmount = parseInt(countSubjects.rows[0].count);
              const pagesAmount = Math.ceil(subjectsAmount / pageSize);
        
              if (page > pagesAmount) {
                throw new NotFoundException('Page not found');
              }
        
              return {
                subjects: result.rows,
                currentPage: page,
                subjectsAmount,
                pagesAmount,
              };
            } catch (error) {
              console.error(error);
              throw new InternalServerErrorException('Internal error occurred');
            }
    }
        
    async getSubjectById(id: number) {
            try {
              const result = await this.pool.query('SELECT * FROM subjects WHERE id = $1', [id]);
        
              if (result.rows.length === 0) {
                throw new NotFoundException('Subject was not found');
              }
        
              return result.rows[0];
            } catch (error) {
              console.error(error);
              throw new InternalServerErrorException('Internal error occurred');
            }
          }
        
          async findClassesBySubject(subjectId: number) {
            try {
              const result = await this.pool.query(
                `SELECT c.id, c.name, c.school_id, c.year 
                 FROM classes c 
                 JOIN class_subjects cs ON c.id = cs.class_id 
                 WHERE cs.subject_id = $1`,
                [subjectId]
              );
        
              return result.rows;
            } catch (error) {
              console.error(error);
              throw new InternalServerErrorException('Internal error occurred');
            }
    }
        
    async assignClassToSubject(classId: number, subjectId: number) {
            try {
              const classCheck = await this.pool.query('SELECT id FROM classes WHERE id = $1', [classId]);
              const subjectCheck = await this.pool.query('SELECT id FROM subjects WHERE id = $1', [subjectId]);
        
              if (classCheck.rows.length === 0 || subjectCheck.rows.length === 0) {
                throw new BadRequestException('Class or subject does not exist.');
              }
        
              const result = await this.pool.query(
                `INSERT INTO class_subjects (class_id, subject_id) VALUES ($1, $2) RETURNING *`,
                [classId, subjectId]
              );
        
              return result.rows[0];
            } catch (error) {
              console.error(error);
              throw new InternalServerErrorException('Internal error occurred');
            }
    }
}
