import { SetMetadata } from '@nestjs/common';

export const CustomCacheTTL = (ttl: number) => SetMetadata('cacheTTL', ttl);
