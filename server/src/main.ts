import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define the global prefix for all routes
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS configuration for development
  app.enableCors({
    maxAge: 3600,
    allowedHeaders: ['token', 'content-type'],
    exposedHeaders: ['Content-Disposition'],
  });

  // Setup the route to access the Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Quiz API')
    .setDescription('API for managing quizzes on species identification.')
    .setVersion('1.0')
    .addTag('quiz')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Setup the route to access the Swagger UI

  // Starting the app on the configured port
  await app.listen(process.env.PORT || 3001); // Use environment variable for the port
}
bootstrap();
