import { Injectable } from "@nestjs/common";
import Redis from 'ioredis';

@Injectable() 
export class RedisService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis();
    }

    async get(key: string): Promise <string | null> {
        return this.redis.get(key);
    }

    async set(key: string, value: any, ttl: number = 86400): Promise <void> {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    }

    async del(key: string): Promise <void> {
        await this.redis.del(key);
    }
}
