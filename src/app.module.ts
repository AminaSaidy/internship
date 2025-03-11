import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SchoolsModule } from './schools/schools.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true, 
    }),
    SchoolsModule,
    StudentsModule,
    ClassesModule,
    TeachersModule,
    SubjectsModule,
    DatabaseModule
  ],
})
export class AppModule {}