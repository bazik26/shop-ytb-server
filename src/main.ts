import * as session from 'express-session';
import * as passport from 'passport';
import * as express from 'express'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Получаем Express-приложение из NestJS
  const expressApp: express.Express = app.getHttpAdapter().getInstance()

  // Доверяем прокси (для работы cookie и session на Render)
  expressApp.set('trust proxy', 1)
  
  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET || 'keyword',
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       secure: process.env.NODE_ENV === 'production' ? true : false,
  //       httpOnly: true,
  //       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  //       maxAge: 24 * 60 * 60 * 1000,
  //     },
  //   })
  // );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'keyword',
      resave: false,
      saveUninitialized: true, // ✅ Создает сессию даже для неавторизованных
      cookie: {
        secure: process.env.NODE_ENV === 'production', // true на проде
        httpOnly: true,
        sameSite: 'none', // важно для Render
        maxAge: 24 * 60 * 60 * 1000, // 1 день
      },
    })
  );
  

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://cars-euro.com'],
  });

  const config = new DocumentBuilder()
    .setTitle('Аква термикс')
    .setDescription('api documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
