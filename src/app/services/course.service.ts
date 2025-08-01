import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course, CreateCourseRequest } from '../models/course.model';
import { BaseResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/course`;

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<BaseResponse<Course[]>> {
    return this.http.get<BaseResponse<Course[]>>(this.apiUrl);
  }

  getCourseById(id: number): Observable<BaseResponse<Course>> {
    return this.http.get<BaseResponse<Course>>(`${this.apiUrl}/${id}`);
  }

  getMyCourses(): Observable<BaseResponse<Course[]>> {
    return this.http.get<BaseResponse<Course[]>>(`${this.apiUrl}/my-courses`);
  }

  createCourse(request: CreateCourseRequest): Observable<BaseResponse<Course>> {
    return this.http.post<BaseResponse<Course>>(this.apiUrl, request);
  }

  updateCourse(id: number, request: CreateCourseRequest): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteCourse(id: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${id}`);
  }

  enrollInCourse(id: number): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${id}/enroll`, {});
  }

  unenrollFromCourse(id: number): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${id}/unenroll`, {});
  }
} 