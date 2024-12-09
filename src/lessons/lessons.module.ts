import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './lesson.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    AuthModule, // Add AuthModule here
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
