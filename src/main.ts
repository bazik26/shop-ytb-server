import * as session from 'express-session';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'keyword',   // Должно быть уникальным и защищенным
      resave: false,       // Уменьшает нагрузку на базу данных
      saveUninitialized: false, // Не создаем пустые сессии
      cookie: {
        secure: false,
        // secure: process.env.NODE_ENV === 'production', // true только для HTTPS
        httpOnly: true,   // Защита от XSS-атак
        maxAge: 24 * 60 * 60 * 1000, // 1 день
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://shop-ytb-client.onrender.com'],
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
