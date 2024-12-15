/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Delete, Put, Param, UseGuards } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Video } from './videos.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  async findAll(): Promise<Video[]> {
    return this.videosService.findAll();
  }

  @Post()
@UseGuards(AuthGuard)
async create(@Body() video: Partial<Video>) {
  const createdVideo = await this.videosService.create(video);
  return { message: 'Video created successfully', data: createdVideo };
}

@Put(':id')
@UseGuards(AuthGuard)
async update(@Param('id') id: number, @Body() updateVideoDto: Partial<Video>) {
  const updatedVideo = await this.videosService.update(id, updateVideoDto);
  return { message: 'Video updated successfully', data: updatedVideo };
}

@Delete(':id')
@UseGuards(AuthGuard) // Protect with authentication
async delete(@Param('id') id: number) {
  await this.videosService.delete(id);
  return { message: 'Video deleted successfully' };
}

}
