import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SchoolsModule } from './schools/schools.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true, 
    }),
    SchoolsModule,
    StudentsModule,
    ClassesModule,
  ],
})
export class AppModule {}