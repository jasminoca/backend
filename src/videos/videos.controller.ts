/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Patch, Delete, Body, Param, } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Video } from './videos.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() video: Video) {
    return this.videosService.create(video);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Video>) {
    return this.videosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
