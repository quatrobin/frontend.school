export interface Course {
  id: number;
  name: string;
  description?: string;
  teacherName: string;
  createdAt: string;
  isActive: boolean;
  studentsCount: number;
  lessonsCount: number;
}

export interface CreateCourseRequest {
  name: string;
  description?: string;
}

export interface Lesson {
  id: number;
  title: string;
  content?: string;
  courseName: string;
  scheduledAt: string;
  durationMinutes: number;
  createdAt: string;
  assignmentsCount: number;
}

export interface CreateLessonRequest {
  title: string;
  content?: string;
  courseId: number;
  scheduledAt: string;
  durationMinutes: number;
} 