/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { User } from './user.entity';  
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'defaultSecret', // Replace with a secure secret
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
