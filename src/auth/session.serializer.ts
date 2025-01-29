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
    done(null, user.userId);
  }

  async deserializeUser(userId: number, done: (err: Error | null, user?: any) => void) {
    console.log('🔄 Десериализация пользователя по userId:', userId);
  
    const user = await this.usersService.findOne({ where: { id: Number(userId) } }); // 👈 Преобразуем в число
  
    if (!user) {
      console.error('❌ Ошибка: пользователь не найден!', userId);
      return done(null, false);
    }
  
    console.log('✅ Десериализованный пользователь:', user);
    done(null, user);
  }
}
