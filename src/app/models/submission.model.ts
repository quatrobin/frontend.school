export interface Submission {
  id: number;
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentName: string;
  content?: string;
  fileUrl?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: number;
  graderName?: string;
  isGraded: boolean;
}

export interface CreateSubmissionRequest {
  assignmentId: number;
  content?: string;
  fileUrl?: string;
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: string;
} 