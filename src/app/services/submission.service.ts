import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Submission, CreateSubmissionRequest, GradeSubmissionRequest } from '../models/submission.model';
import { BaseResponse } from '../models/base-response.model';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private apiUrl = environment.apiUrl + '/submission';

  constructor(private http: HttpClient) {}

  getSubmissionsByAssignment(assignmentId: number): Observable<BaseResponse<Submission[]>> {
    console.log('SubmissionService.getSubmissionsByAssignment: Making request to:', `${this.apiUrl}/assignment/${assignmentId}`);
    return this.http.get<BaseResponse<Submission[]>>(`${this.apiUrl}/assignment/${assignmentId}`);
  }

  getSubmissionsByStudent(studentId: number): Observable<BaseResponse<Submission[]>> {
    console.log('SubmissionService.getSubmissionsByStudent: Making request to:', `${this.apiUrl}/student/${studentId}`);
    return this.http.get<BaseResponse<Submission[]>>(`${this.apiUrl}/student/${studentId}`);
  }

  getSubmissionById(id: number): Observable<BaseResponse<Submission>> {
    return this.http.get<BaseResponse<Submission>>(`${this.apiUrl}/${id}`);
  }

  createSubmission(request: CreateSubmissionRequest): Observable<BaseResponse<Submission>> {
    return this.http.post<BaseResponse<Submission>>(this.apiUrl, request);
  }

  gradeSubmission(submissionId: number, request: GradeSubmissionRequest): Observable<BaseResponse<Submission>> {
    return this.http.post<BaseResponse<Submission>>(`${this.apiUrl}/${submissionId}/grade`, request);
  }

  deleteSubmission(id: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${id}`);
  }
} 