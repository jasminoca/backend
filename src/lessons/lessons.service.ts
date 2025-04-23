/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Lesson } from './lesson.entity';
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
    };
    await docRef.set(lesson);
    return lesson;
  }

  async findAll(): Promise<Lesson[]> {
    const defaultIds = ['whole-numbers', 'fractions', 'measurements', 'decimals'];
    const defaultLessons = await Promise.all(defaultIds.map(id => this.findOne(id)));
    return defaultLessons;
  }

  async findOne(id: string): Promise<Lesson> {
    const doc = await this.lessonsCollection.doc(id).get();

    if (!doc.exists) {
      const fallbackLesson: Lesson = {
        id,
        title: this.formatTitle(id),
        description: '',
        video_url: '',
        keypoints: [],
        questions: [],
        scores: {}
      };
      return fallbackLesson;
    }

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

  // Format default title from ID (e.g., whole-numbers -> Whole Numbers)
  private formatTitle(id: string): string {
    return id
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // KEYPOINT 
  async addKeypoint(lessonId: string, content: string) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    const newKeypoint = { id: randomUUID(), content };
    lesson.keypoints = [...(lesson.keypoints || []), newKeypoint];
    await doc.update({ keypoints: lesson.keypoints });
    return newKeypoint;
  }

  async updateKeypoint(lessonId: string, keypointId: string, content: string) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.keypoints = (lesson.keypoints || []).map((kp) =>
      kp.id === keypointId ? { ...kp, content } : kp
    );
    await doc.update({ keypoints: lesson.keypoints });
    return lesson.keypoints.find((kp) => kp.id === keypointId);
  }

  async deleteKeypoint(lessonId: string, keypointId: string) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.keypoints = (lesson.keypoints || []).filter((kp) => kp.id !== keypointId);
    await doc.update({ keypoints: lesson.keypoints });
  }

  // QUESTION 
  async addQuestion(lessonId: string, data: { question: string; choices: string[]; correctAnswer: string }) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    const newQuestion = { id: randomUUID(), ...data };
    lesson.questions = [...(lesson.questions || []), newQuestion];
    await doc.update({ questions: lesson.questions });
    return newQuestion;
  }

  async updateQuestion(
    lessonId: string,
    questionId: string,
    data: { question: string; choices: string[]; correctAnswer: string }
  ) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.questions = (lesson.questions || []).map((q) =>
      q.id === questionId ? { ...q, ...data } : q
    );
    await doc.update({ questions: lesson.questions });
    return lesson.questions.find((q) => q.id === questionId);
  }

  async deleteQuestion(lessonId: string, questionId: string) {
    const doc = this.lessonsCollection.doc(lessonId);
    const lesson = (await doc.get()).data() as Lesson;
    lesson.questions = (lesson.questions || []).filter((q) => q.id !== questionId);
    await doc.update({ questions: lesson.questions });
  }
}
