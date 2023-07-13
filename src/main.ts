import { NestFactory } from '@nestjs/core';
import copyActivity from './scripts/copyActivity/copyActivity';
import { AppModule } from './app.module';
import { CaptchaModule } from './server/captcha/captcha.module';
import { reqCaptch } from './scripts/seleniumScript/request';
import { example } from './scripts/seleniumScript';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
// bootstrap();

async function captchaEntry() {
  const app = await NestFactory.create(CaptchaModule);
  await app.listen(3000);
}
// captchaEntry();

// 归档复制文件
// copyActivity.entry();

// reqCaptch()

example()
