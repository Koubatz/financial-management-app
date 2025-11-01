import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
  app.enableCors({
    origin: allowedOrigin,
  });
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

bootstrap().catch((error) => {
  // Surface bootstrap failures clearly so CI/tests can detect them.
  if (error instanceof AggregateError) {
    console.error('Failed to start Nest application due to multiple errors:');
    for (const err of error.errors) {
      console.error(err);
    }
  } else {
    console.error('Failed to start Nest application:', error);
  }
  process.exitCode = 1;
});
