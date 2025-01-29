import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error | null, user?: any) => void) {
    console.log('✅ Сериализация пользователя:', user)
    done(null, { userId: user.id, username: user.username, email: user.email }) // Сохраняем только нужные данные
  }

  deserializeUser(payload: any, done: (err: Error | null, user?: any) => void) {
    console.log('✅ Десериализация пользователя:', payload)
    done(null, payload) // Восстанавливаем пользователя из сессии
  }
}
