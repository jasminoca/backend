/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Score } from './scores.entity';

@Injectable()
export class ScoresService {
  private db = admin.firestore();
  private scoresCollection = this.db.collection('scores');
  private lessonsCollection = this.db.collection('lessons');

  async submitLessonScore(
    lessonId: string,
    schoolId: string,
    answers: { [questionId: string]: string },
    attemptsFromFrontend?: number,
  ): Promise<void> {
    const docId = `${lessonId}_${schoolId}`;
  
    const lessonSnapshot = await this.lessonsCollection.doc(lessonId).get();
    const lessonData = lessonSnapshot.data();
  
    let score = 0;
  
    if (lessonData && lessonData.questions) {
      for (const question of lessonData.questions) {
        const qid = question.id;
        const correct = question.correctAnswer?.toLowerCase().trim();
        const studentAnswer = answers[qid]?.toLowerCase().trim();
        if (studentAnswer && studentAnswer === correct) {
          score++;
        }
      }
    }
  
    const data = {
      answers,
      score,
      school_id: schoolId,
      lessonId,
      lessonTitle: lessonData?.title || '',
      type: 'lesson',
      created_at: new Date().toISOString(),
      attempts: attemptsFromFrontend ?? 1,
    };
  
    await this.scoresCollection.doc(docId).set(data);
  }
  

  async getScoreForLesson(lessonId: string, schoolId: string): Promise<any> {
    const docId = `${lessonId}_${schoolId}`;
    const doc = await this.scoresCollection.doc(docId).get();
    if (!doc.exists) return null;
    return doc.data();
  }
  
  // Student submitting a game score
  async submitGameScore(data: any) {
    const { school_id, game_name, score } = data;
    await this.db.collection('scores').add({
      school_id,
      game_name,
      score,
      created_at: new Date(),
      type: 'game',  
    });
  }
  

  // Student fetch their personal scores (lesson or game)
  async getStudentLessonScores(schoolId: string): Promise<Score[]> {
    const snapshot = await this.scoresCollection
      .where('type', '==', 'lesson')
      .where('school_id', '==', schoolId)
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as Score);
  }

  async getStudentGameScores(schoolId: string): Promise<any[]> {
    const snapshot = await this.db.collection('games')
      .where('school_id', '==', schoolId)
      .get();
  
    return snapshot.docs.map(doc => doc.data());
  }

  // Teacher/Admin fetch all students' scores by type
  async getAllLessonScores(): Promise<Score[]> {
    const snapshot = await this.scoresCollection
      .where('type', '==', 'lesson')
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as Score);
  }

  async getAllGameScores(): Promise<any[]> {
    const snapshot = await this.db.collection('games').get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Leaderboard for games only (Top scores)
  async getGameLeaderboard(limit: number = 10): Promise<Score[]> {
    const snapshot = await this.scoresCollection
      .where('type', '==', 'game')
      .orderBy('score', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data() as Score);
  }

  // View student's previous lesson score for reloading on LessonPage
  async getStudentScore(lessonId: string, schoolId: string): Promise<Score | null> {
    const docId = `${lessonId}_${schoolId}`;
    const scoreDoc = await this.scoresCollection.doc(docId).get();
  
    if (!scoreDoc.exists) return null;
    return scoreDoc.data() as Score;
  }
  
  // Used in GET /scores/:lessonId/:schoolId
  async getScoreByLessonAndSchool(lessonId: string, schoolId: string) {
    const score = await this.getStudentScore(lessonId, schoolId);
    if (!score) return {};
  
    return {
      answers: score.answers || {},
      score: score.score || 0,
      attempts: score.attempts || 0,
      school_id: score.school_id,
      lessonId: score.lessonId,
      lessonTitle: score.lessonTitle,
      type: score.type,
      created_at: score.created_at,
    };
  }
  
}
