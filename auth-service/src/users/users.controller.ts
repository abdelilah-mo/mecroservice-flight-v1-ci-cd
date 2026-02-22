import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.usersService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.usersService.login(body.email, body.password);
  }
}