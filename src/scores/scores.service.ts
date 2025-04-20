/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Score } from './scores.entity';

@Injectable()
export class ScoresService {
  private db = admin.firestore();
  private scoresCollection = this.db.collection('scores');

  async create(score: Score): Promise<Score> {
    const docRef = this.scoresCollection.doc();
    const scoreWithMeta: Score = {
      ...score,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await docRef.set(scoreWithMeta);
    return scoreWithMeta;
  }

  async findAll(): Promise<Score[]> {
    const snapshot = await this.scoresCollection.get();
    return snapshot.docs.map(doc => doc.data() as Score);
  }

  async findByUser(userId: string): Promise<Score[]> {
    const snapshot = await this.scoresCollection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => doc.data() as Score);
  }

  async findOne(id: string): Promise<Score> {
    const doc = await this.scoresCollection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return doc.data() as Score;
  }

  async update(id: string, updateData: Partial<Score>): Promise<Score> {
    const docRef = this.scoresCollection.doc(id);
    await docRef.update({ ...updateData });
    const updatedDoc = await docRef.get();
    return updatedDoc.data() as Score;
  }

  async remove(id: string): Promise<void> {
    await this.scoresCollection.doc(id).delete();
  }
}
