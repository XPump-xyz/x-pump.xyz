import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { contentParser } from 'fastify-file-interceptor';
import { join } from 'path';
import FastifyStatic from '@fastify/static';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({}),
  );
  app.setGlobalPrefix('/api/v1');
  app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(contentParser);
  // app.register(FastifyStatic, {
  //   root: join(__dirname, '..', 'uploads'),
  //   prefix: '/images/',
  //   prefixAvoidTrailingSlash: true,
  // });

  const staticClientPath = join(__dirname, '../dist/static');
  app.register(FastifyStatic, {
    root: staticClientPath,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());

  app.enableCors({
    origin: [
      'https://zupad.org',
      'https://c476fd179897.ngrok.app',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  const port = process.env.BACKEND_LOCAL_PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}
bootstrap();
