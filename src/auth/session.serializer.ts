import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user?: any) => void) {
    console.log('✅ Сериализация пользователя:', user);
    if (!user || !user.userId) {
      console.error('❌ Ошибка: userId отсутствует в объекте пользователя!', user);
    }
    done(null, user.userId); // Сохраняем только userId в сессию
  }

  async deserializeUser(userId: number, done: (err: Error | null, user?: any) => void) {
    console.log('🔄 Десериализация пользователя по userId:', userId);
    
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        console.error('❌ Ошибка: Пользователь не найден при десериализации!', userId);
        return done(null, null);
      }
      console.log('✅ Десериализованный пользователь:', user);
      done(null, user);
    } catch (error) {
      console.error('❌ Ошибка при десериализации пользователя:', error);
      done(error);
    }
  }
}
