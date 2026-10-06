import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post('anonymous')
  createAnonymous(@Body() body: { alias: string; seed: string }) {
    return this.usersService.createAnonymousUser(body.alias, body.seed);
  }
}
