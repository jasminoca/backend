/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Lesson } from './lesson.entity';
import { v4 as uuidv4 } from 'uuid';
import { arrayUnion } from 'firebase/firestore'; 
import { randomUUID } from 'crypto';

@Injectable()
export class LessonsService {
  private db = admin.firestore();
  private lessonsCollection = this.db.collection('lessons');

  async create(data: Lesson): Promise<Lesson> {
    const docRef = this.lessonsCollection.doc();
    const lesson: Lesson = {
      ...data,
      id: docRef.id,
      keypoints: [],
      questions: [],
      isEnabled: false,
      difficulty: 'beginner',
    };
    await docRef.set(lesson);
    return lesson;
  }

  async findAll(): Promise<Lesson[]> {
    const snapshot = await this.lessonsCollection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[];
  }

  async findOne(id: string): Promise<Lesson> {
    const doc = await this.lessonsCollection.doc(id).get();
    if (!doc.exists) throw new Error(`Lesson with id ${id} not found`);
    return doc.data() as Lesson;
  }

  async update(id: string, updateData: Partial<Lesson>): Promise<Lesson> {
    const docRef = this.lessonsCollection.doc(id);
    await docRef.set(updateData, { merge: true });
    const updated = await docRef.get();
    return updated.data() as Lesson;
  }

  async remove(id: string): Promise<void> {
    await this.lessonsCollection.doc(id).delete();
  }

  // Format title
  private formatTitle(id: string): string {
    return id
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // KEYPOINT
  async addKeypoint(lessonId: string, content: string) {
    const lessonDoc = this.lessonsCollection.doc(lessonId);
    const keypointId = randomUUID();
    const keypoint = { id: keypointId, content };

    await lessonDoc.update({
      keypoints: admin.firestore.FieldValue.arrayUnion(keypoint),
    });

    return keypoint;
  }

  async updateKeypoint(lessonId: string, keypointId: string, content: string) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.keypoints = (lesson.keypoints || []).map((kp: any) =>
      kp.id === keypointId ? { ...kp, content } : kp
    );
    await doc.update({ keypoints: lesson.keypoints });
    return lesson.keypoints.find((kp: any) => kp.id === keypointId);
  }

  async editKeypoint(lessonId: string, keypointId: string, content: string): Promise<void> {
    const lessonRef = this.lessonsCollection.doc(lessonId);
    const lessonDoc = await lessonRef.get();
    if (!lessonDoc.exists) throw new Error('Lesson not found');

    const lessonData = lessonDoc.data();
    if (!lessonData) throw new Error('Lesson data is undefined');

    const updatedKeypoints = (lessonData.keypoints || []).map((kp: any) =>
      kp.id === keypointId ? { ...kp, content } : kp
    );

    await lessonRef.update({ keypoints: updatedKeypoints });
  }

  async deleteKeypoint(lessonId: string, keypointId: string) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.keypoints = (lesson.keypoints || []).filter((kp: any) => kp.id !== keypointId);
    await doc.update({ keypoints: lesson.keypoints });
  }

  // QUESTION
  async addQuestion(lessonId: string, data: any) {
    const lessonDoc = this.lessonsCollection.doc(lessonId);
    const questionId = randomUUID();
    const question = {
      id: questionId,
      question: data.question,
      choices: data.choices,
      correctAnswer: data.correctAnswer,
    };

    await lessonDoc.update({
      questions: admin.firestore.FieldValue.arrayUnion(question),
    });

    return question;
  }

  async getLessonById(id: string) {
    const doc = await this.lessonsCollection.doc(id).get();
    if (!doc.exists) throw new NotFoundException('Lesson not found');

    const lesson = doc.data()!;
    lesson.keypoints = lesson.keypoints || [];
    lesson.questions = lesson.questions || [];
    return lesson;
  }

  async updateQuestion(
    lessonId: string,
    questionId: string,
    data: { question: string; choices: string[]; correctAnswer: string }
  ) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.questions = (lesson.questions || []).map((q: any) =>
      q.id === questionId ? { ...q, ...data } : q
    );
    await doc.update({ questions: lesson.questions });
    return lesson.questions.find((q: any) => q.id === questionId);
  }

  async editQuestion(lessonId: string, questionId: string, updateData: any): Promise<void> {
    const lessonRef = this.lessonsCollection.doc(lessonId);
    const lessonDoc = await lessonRef.get();
    if (!lessonDoc.exists) throw new Error('Lesson not found');

    const lessonData = lessonDoc.data();
    if (!lessonData) throw new Error('Lesson data is undefined');

    const updatedQuestions = (lessonData.questions || []).map((q: any) =>
      q.id === questionId ? { ...q, ...updateData } : q
    );

    await lessonRef.update({ questions: updatedQuestions });
  }

  async deleteQuestion(lessonId: string, questionId: string) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.questions = (lesson.questions || []).filter((q: any) => q.id !== questionId);
    await doc.update({ questions: lesson.questions });
  }

  // SUBMIT SCORE
  async submitLessonScore(lessonId: string, schoolId: string, answers: any): Promise<void> {
    const scoresCollection = this.db.collection('scores');
    const docId = `${lessonId}_${schoolId}`;
    const scoreDoc = await scoresCollection.doc(docId).get();

    let attempts = 1;
    if (scoreDoc.exists) {
      const data = scoreDoc.data();
      attempts = (data?.attempts || 0) + 1;
    }

    const lessonRef = this.lessonsCollection.doc(lessonId);
    const lessonData = (await lessonRef.get()).data();
    const questions = lessonData?.questions || [];

    let correct = 0;
    (questions || []).forEach((q: any) => {
      if (answers[q.id] && answers[q.id].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });

    await scoresCollection.doc(docId).set({
      lessonId,
      schoolId,
      attempts,
      answers,
      score: correct,
    });
  }

  // Enable & Difficulty
  async updateLessonEnableStatus(id: string, isEnabled: boolean): Promise<void> {
    const lessonRef = this.lessonsCollection.doc(id);
    await lessonRef.update({ isEnabled });
  }

  async updateLessonDifficulty(id: string, difficulty: string): Promise<void> {
    const lessonRef = this.lessonsCollection.doc(id);
    await lessonRef.update({ difficulty });
  }

  async getScoreByLessonAndSchool(lessonId: string, schoolId: string) {
    const scoresCollection = this.db.collection('scores');
    const docId = `${lessonId}_${schoolId}`;
    const scoreDoc = await scoresCollection.doc(docId).get();
  
    if (!scoreDoc.exists) {
      return null;
    }
  
    return scoreDoc.data();
  }
  
}