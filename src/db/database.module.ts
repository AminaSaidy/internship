import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { RedisService } from '../redis/redis.service';

@Module({
    imports: [ConfigModule],
    providers: [DatabaseService, RedisService],
    exports: [DatabaseService, RedisService],
})
export class DatabaseModule {}