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
    done(null, user.userId); // Теперь передаём только userId
  }

  async deserializeUser(userId: number, done: (err: Error | null, user?: any) => void) {
    console.log('🔄 Десериализация пользователя по userId:', userId);

    const user = await this.usersService.findOne({ where: { id: userId } });

    if (!user) {
      console.error('❌ Ошибка: пользователь не найден!', userId);
      return done(null, false);
    }

    console.log('✅ Десериализованный пользователь:', user);
    done(null, user);
  }
}

