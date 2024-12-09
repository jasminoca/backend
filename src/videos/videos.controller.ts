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
  @UseGuards(AuthGuard) // Protect with authentication
  async create(@Body() video: Partial<Video>): Promise<Video> {
    return this.videosService.create(video);
  }

  // Update a video by ID
  @Put(':id')
  @UseGuards(AuthGuard) // Protect with authentication
  async update(
    @Param('id') id: number,
    @Body() updateVideoDto: Partial<Video>,
  ): Promise<Video> {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) // Protect with authentication
  async delete(@Param('id') id: number): Promise<void> {
    return this.videosService.delete(id);
  }
}
