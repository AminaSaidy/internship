import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async get(key: string): Promise<string | null> {
    const data = await this.redis.call('JSON.GET', key);
    return data ? JSON.parse(data as string).data : null;
  }

  async set(key: string, value: any, ttl: number = 86400): Promise<void> {
    await this.redis.call('JSON.SET', key, '.', JSON.stringify(value));
    await this.redis.expire(key, ttl);
  }

  async del(key: string): Promise<void> {
    await this.redis.call('JSON.DEL', key);
  }
}
