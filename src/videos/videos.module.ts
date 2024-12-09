import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from '../videos/videos.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    AuthModule, // Add AuthModule here
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
