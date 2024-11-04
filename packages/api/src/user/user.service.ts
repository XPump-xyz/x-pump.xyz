import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from 'nestjs-prisma-crud';
import { CacheService } from '../cache/cache.service';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class UserService extends PrismaCrudService {
  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService,
  ) {
    super({
      model: 'user',
      allowedJoins: [],
      defaultJoins: [],
    });
  }

  async findById(id: number) {
    return this.prismaService.$extends(withAccelerate()).user.findUnique({
      where: { id },
      include: {},
      cacheStrategy: {
        ttl: 60,
        swr: 60,
      },
    });
  }

  async getAndSaveUser(id: number) {
    const user = await this.prismaService
      .$extends(withAccelerate())
      .user.findUnique({
        where: { id },
        include: {},
        cacheStrategy: {
          ttl: 60,
          swr: 60,
        },
      });
    const key = `${user.id}:/api/v1/user/me`;
    await this.cacheService.setCache(key, user, 60 * 1000);
    return user;
  }
}
