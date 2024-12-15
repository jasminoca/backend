/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../videos/videos.entity';
import { Lesson } from '../lessons/lesson.entity';


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
    return this.videosRepository.find({
      select: ['id', 'title', 'url', 'lesson'], // Explicitly include lessonId
      relations: ['lesson'],
    });
  }
  
  // Create a new video
  async create(video: Partial<Video>): Promise<Video> {
    if (!video.lesson || !video.lesson.id) {
      throw new Error('Lesson ID is required.');
    }
  
    const lessonRepository = this.videosRepository.manager.getRepository(Lesson);
    const lesson = await lessonRepository.findOne({ where: { id: video.lesson.id } });
  
    if (!lesson) {
      throw new Error('Associated Lesson not found.');
    }
  
    const newVideo = this.videosRepository.create({
      ...video,
      lesson: lesson,
    });
  
    return await this.videosRepository.save(newVideo);
  }

  // Delete a video by ID
  async delete(id: number): Promise<void> {
    const video = await this.videosRepository.findOne({ where: { id } });
    if (!video) {
      throw new Error('Video not found');
    }
    await this.videosRepository.delete(id);
  }
  
}
