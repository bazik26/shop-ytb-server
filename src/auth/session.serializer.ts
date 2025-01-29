import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error | null, user?: any) => void) {
    console.log('✅ Сериализация пользователя:', user)
    if (!user || !user.userId) {
      console.error('❌ Ошибка: userId отсутствует в объекте пользователя!', user)
    }
    done(null, { userId: user.userId, username: user.username, email: user.email })
  }

  deserializeUser(payload: any, done: (err: Error | null, user?: any) => void) {
    console.log('✅ Десериализация пользователя:', payload)
    if (!payload || !payload.userId) {
      console.error('❌ Ошибка: userId отсутствует при десериализации!', payload)
    }
    done(null, payload)
  }
}
