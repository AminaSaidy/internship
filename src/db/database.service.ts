import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Pool} from 'pg';

@Injectable ()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    
    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool ({
            user: this.configService.get<string>('DB_USER'),
            host: this.configService.get<string>('DB_HOST'),
            database: this.configService.get<string>('DB_NAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            port: this.configService.get<number>('DB_PORT'),
        });
    }

    getPool(): Pool {
        return this.pool;
    }

    async onModuleInit() {
        console.log('DatabaseService initialized');
    }

    async onModuleDestroy() {
        await this.pool.end();
        console.log('DatabaseService connection closed');
    }
}