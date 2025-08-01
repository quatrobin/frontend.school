export interface Assignment {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  courseName: string;
  dueDate: string;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  courseId: number;
  dueDate: string;
  maxScore: number;
}

export interface SubmitAssignmentRequest {
  assignmentId: number;
  content?: string;
}

export interface GradeAssignmentRequest {
  submissionId: number;
  score: number;
  feedback?: string;
} 