import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SchoolsModule } from './schools/schools.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true, 
    }),
    SchoolsModule,
  ],
})
export class AppModule {}