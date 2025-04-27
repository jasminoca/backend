/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Score } from './scores.entity';

@Injectable()
export class ScoresService {
  private db = admin.firestore();
  private scoresCollection = this.db.collection('scores');
  private lessonsCollection = this.db.collection('lessons');

  // Student submitting a lesson score
  async submitLessonScore(lessonId: string, schoolId: string, answers: { [questionId: string]: string }): Promise<void> {
    const docId = `${lessonId}_${schoolId}`;
    const scoreDoc = await this.scoresCollection.doc(docId).get();

    let attempts = 1;
    if (scoreDoc.exists) {
      const data = scoreDoc.data();
      attempts = (data?.attempts || 0) + 1;
    }

    const lessonDoc = await this.lessonsCollection.doc(lessonId).get();
    const lessonData = lessonDoc.data();
    const questions = lessonData?.questions || [];

    let correct = 0;
    (questions || []).forEach((q: any) => {
      if (answers[q.id] && answers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });

    await this.scoresCollection.doc(docId).set({
      school_id: schoolId,
      type: 'lesson',
      lessonId: lessonId,
      score: correct,
      answers: answers,
      attempts: attempts,
      created_at: Date.now(),
    });
  }

  // Student submitting a game score
  async submitGameScore(schoolId: string, game_name: string, score: number): Promise<void> {
    await this.scoresCollection.add({
      school_id: schoolId,
      type: 'game',
      game_name: game_name,
      score: score,
      created_at: Date.now(),
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

  async getStudentGameScores(schoolId: string): Promise<Score[]> {
    const snapshot = await this.scoresCollection
      .where('type', '==', 'game')
      .where('school_id', '==', schoolId)
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as Score);
  }

  // Teacher/Admin fetch all students' scores by type
  async getAllLessonScores(): Promise<Score[]> {
    const snapshot = await this.scoresCollection
      .where('type', '==', 'lesson')
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as Score);
  }

  async getAllGameScores(): Promise<Score[]> {
    const snapshot = await this.scoresCollection
      .where('type', '==', 'game')
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as Score);
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
  
    if (!scoreDoc.exists) {
      return null;
    }
  
    return scoreDoc.data() as Score;
  }
  
  async getScoreByLessonAndSchool(lessonId: string, schoolId: string) {
    const docId = `${lessonId}_${schoolId}`;
    const doc = await this.scoresCollection.doc(docId).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  }
}
