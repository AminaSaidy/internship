import { Module } from "@nestjs/common";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./classes.service";
import { DatabaseModule } from "../db/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
