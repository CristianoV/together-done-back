import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API Documentation')
  .setVersion('1.0')
  .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000).then(() => {
    console.log(`
      ${
        process.env.ENV === 'DEVELOPMENT'
          ? `
        🚀 Server is running on http://localhost:${process.env.PORT ?? 3000} in ${process.env.ENV} mode 🚀
      
        Press CTRL-C to stop
        `
          : `
        🌐 Server is running on port ${process.env.PORT ?? 3000} in ${process.env.ENV} mode 🌐
        `
      }
      `);
      
  });
}
bootstrap();
