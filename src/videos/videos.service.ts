/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Video } from './videos.entity';

@Injectable()
export class VideosService {
  private db = admin.firestore();
  private videosCollection = this.db.collection('videos');

  async create(data: Video): Promise<Video> {
    const docRef = this.videosCollection.doc();
    const video: Video = {
      ...data,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await docRef.set(video);
    return video;
  }

  async findAll(): Promise<Video[]> {
    const snapshot = await this.videosCollection.get();
    return snapshot.docs.map(doc => doc.data() as Video);
  }

  async findOne(id: string): Promise<Video> {
    const doc = await this.videosCollection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return doc.data() as Video;
  }

  async update(id: string, data: Partial<Video>): Promise<Video> {
    const docRef = this.videosCollection.doc(id);
    await docRef.update({ ...data });
    const updated = await docRef.get();
    return updated.data() as Video;
  }

  async remove(id: string): Promise<void> {
    await this.videosCollection.doc(id).delete();
  }
}
