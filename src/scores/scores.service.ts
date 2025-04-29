/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Score } from './scores.entity';

@Injectable()
export class ScoresService {
  private db = admin.firestore();
  private scoresCollection = this.db.collection('scores');

  // Student submitting a lesson score
  async submitLessonScore(lessonId: string, schoolId: string, answers: { [questionId: string]: string }): Promise<void> {
    const lessonDoc = await admin.firestore().collection('lessons').doc(lessonId).get();
    const lessonData = lessonDoc.data();
    const lessonTitle = lessonData?.title || "Untitled";
  
    const correctAnswers = (lessonData?.questions || []).reduce((acc: any, q: any) => {
      acc[q.id] = q.correctAnswer;
      return acc;
    }, {});
  
    let score = 0;
    for (const qId in answers) {
      if (answers[qId]?.trim().toLowerCase() === correctAnswers[qId]?.trim().toLowerCase()) {
        score++;
      }
    }
  
    // When saving, include lesson_title
    const scoreDoc = this.scoresCollection.doc(`${lessonId}_${schoolId}`);
    await scoreDoc.set({
      lessonId,
      lessonTitle, // ➡️ Save title along with score
      school_id: schoolId,
      answers,
      score,
      created_at: new Date().toISOString(),
      type: "lesson",
    });
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
  
  async getScoreByLessonAndSchool(lessonId: string, schoolId: string): Promise<any> {
    const snapshot = await this.scoresCollection
      .where('lessonId', '==', lessonId)
      .where('schoolId', '==', schoolId)
      .limit(1)
      .get();
  
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }
  
}
