import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lesson, CreateLessonRequest, UpdateLessonRequest } from '../models/lesson.model';
import { BaseResponse } from '../models/base-response.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private apiUrl = environment.apiUrl + '/lesson';

  constructor(private http: HttpClient) {}

  getAllLessons(): Observable<BaseResponse<Lesson[]>> {
    return this.http.get<BaseResponse<Lesson[]>>(this.apiUrl);
  }

  getLessonsByCourse(courseId: number): Observable<BaseResponse<Lesson[]>> {
    return this.http.get<BaseResponse<Lesson[]>>(`${this.apiUrl}/course/${courseId}`);
  }

  getLessonById(id: number): Observable<BaseResponse<Lesson>> {
    return this.http.get<BaseResponse<Lesson>>(`${this.apiUrl}/${id}`);
  }

  createLesson(request: CreateLessonRequest): Observable<BaseResponse<Lesson>> {
    return this.http.post<BaseResponse<Lesson>>(this.apiUrl, request);
  }

  updateLesson(id: number, request: UpdateLessonRequest): Observable<BaseResponse<Lesson>> {
    return this.http.put<BaseResponse<Lesson>>(`${this.apiUrl}/${id}`, request);
  }

  deleteLesson(id: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${id}`);
  }
} 