import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { eventProxy } from './utill/proxy.middleware';

const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '../src/view', 'public'));
  app.setBaseViewsDir(join(__dirname, '../src', 'view'));
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
