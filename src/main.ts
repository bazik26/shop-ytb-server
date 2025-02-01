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
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'keyword',
      resave: false, // Оставляем false, чтобы не пересохранять сессию при каждом запросе
      saveUninitialized: false, // Оставляем false, чтобы не создавать пустые сессии
      cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false, // На проде true, локально false
        httpOnly: true, // Доступен только серверу, защита от XSS-атак
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' для Render, 'lax' локально
        maxAge: 24 * 60 * 60 * 1000, // Время жизни куки (1 день)
      },
    })
  );  
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3002', 'https://shop-ytb-client.onrender.com'],
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
