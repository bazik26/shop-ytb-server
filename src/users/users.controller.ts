import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  LoginCheckResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserResponse,
  SignupResponse,
} from './types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: SignupResponse })
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    console.log('✅ Логин успешен, req.user:', req.user);
    return { user: { userId: req.user.id, username: req.user.username, email: req.user.email }, msg: 'Logged in' };
  }
  
  // @Get('/login-check')
  // @UseGuards(AuthenticatedGuard)
  // loginCheck(@Request() req) {
  // console.log('🔵 Проверка логина');
  // console.log('🔵 req.user:', req.user);
  // console.log('🔵 req.session:', req.session);
  // return req.user;
  // }

  @Get('/login-check')
  // @UseGuards(AuthenticatedGuard)  <-- Убираем проверку
  loginCheck(@Request() req) {
  console.log('🔵 Проверка логина');
  console.log('🔵 req.user:', req.user);
  console.log('🔵 req.session:', req.session);
  // Если пользователь не авторизован, вернуть объект гостя
  return req.user || { guest: true };
  }



  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'session has ended' };
  }
}
