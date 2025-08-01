export interface Lesson {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  courseName: string;
  lessonDate: string;
  durationMinutes: number;
  materials?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  courseId: number;
  lessonDate: string;
  durationMinutes: number;
  materials?: string;
}

export interface UpdateLessonRequest {
  title: string;
  description?: string;
  courseId: number;
  lessonDate: string;
  durationMinutes: number;
  materials?: string;
} 