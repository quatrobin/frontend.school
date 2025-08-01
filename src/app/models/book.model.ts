export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publicationYear: number;
  publisher?: string;
  pages: number;
  language?: string;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
}

export interface CreateBookRequest {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publicationYear: number;
  publisher?: string;
  pages: number;
  language?: string;
  courseIds: number[];
}

export interface UpdateBookRequest {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publicationYear: number;
  publisher?: string;
  pages: number;
  language?: string;
  courseIds: number[];
}

export interface Course {
  id: number;
  name: string;
  description?: string;
} 