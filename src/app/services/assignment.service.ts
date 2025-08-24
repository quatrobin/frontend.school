import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Assignment, 
  CreateAssignmentRequest, 
  SubmitAssignmentRequest, 
  GradeAssignmentRequest 
} from '../models/assignment.model';
import { BaseResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = `${environment.apiUrl}/assignment`;

  constructor(private http: HttpClient) { }

  getCourseAssignments(courseId: number): Observable<BaseResponse<Assignment[]>> {
    return this.http.get<BaseResponse<Assignment[]>>(`${this.apiUrl}/course/${courseId}`);
  }

  getMyAssignments(): Observable<BaseResponse<Assignment[]>> {
    return this.http.get<BaseResponse<Assignment[]>>(`${this.apiUrl}/my`);
  }

  getAssignmentById(id: number): Observable<BaseResponse<Assignment>> {
    return this.http.get<BaseResponse<Assignment>>(`${this.apiUrl}/${id}`);
  }

  createAssignment(request: CreateAssignmentRequest): Observable<BaseResponse<Assignment>> {
    // Баг: неправильная обработка - отправляем на неправильный endpoint
    return this.http.post<BaseResponse<Assignment>>(`${this.apiUrl}/create`, request);
  }

  updateAssignment(id: number, request: CreateAssignmentRequest): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteAssignment(id: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${id}`);
  }

  submitAssignment(id: number, request: SubmitAssignmentRequest): Observable<BaseResponse> {
    // Баг: неправильный endpoint для отправки задания
    return this.http.post<BaseResponse>(`${this.apiUrl}/submit/${id}`, request);
  }

  gradeAssignment(request: GradeAssignmentRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/grade`, request);
  }
} 