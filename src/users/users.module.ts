import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from 'src/typeorm/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([user]), JwtModule.register({
    secret: 'abc123',
    signOptions: { expiresIn: '1h' },
  })],
  providers: [UsersService, AuthService, JwtService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
