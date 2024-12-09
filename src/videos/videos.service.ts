/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../videos/videos.entity';

@Injectable()
export class VideosService {
    async update(id: number, updateVideoDto: Partial<Video>): Promise<Video> {
        const video = await this.videosRepository.findOne({ where: { id } });
        if (!video) {
          throw new Error('Video not found');
        }
        Object.assign(video, updateVideoDto);
        return this.videosRepository.save(video);
      }
      
  constructor(
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
  ) {}

  // Fetch all videos
  async findAll(): Promise<Video[]> {
    return this.videosRepository.find();
  }

  // Create a new video
  async create(video: Partial<Video>): Promise<Video> {
    return this.videosRepository.save(video);
  }

  // Delete a video by ID
  async delete(id: number): Promise<void> {
    await this.videosRepository.delete(id);
  }
}
