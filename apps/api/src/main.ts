import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

bootstrap().catch((error) => {
  // Surface bootstrap failures clearly so CI/tests can detect them.
  console.error('Failed to start Nest application', error);
  process.exitCode = 1;
});
