/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class GamesService {
  private db = admin.firestore();
  private gamesCollection = this.db.collection('games');

  async submitGameScore(data: any): Promise<void> {
    const gameScore = {
      lessonId: data.lessonId,
      studentName: data.studentName,
      score: data.score,
      type: data.type,
      school_id: data.school_id, 
    };

    await this.gamesCollection.add(gameScore);
  }
  
  async getAllGameScores(): Promise<any[]> {
    const snapshot = await this.gamesCollection.get();
    return snapshot.docs.map(doc => doc.data());
  }
  
}
