import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book, CreateBookRequest, UpdateBookRequest } from '../models/book.model';
import { BaseResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/book`;

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<BaseResponse<Book[]>> {
    return this.http.get<BaseResponse<Book[]>>(`${this.apiUrl}`);
  }

  getBookById(id: number): Observable<BaseResponse<Book>> {
    return this.http.get<BaseResponse<Book>>(`${this.apiUrl}/${id}`);
  }

  getBooksByCourse(courseId: number): Observable<BaseResponse<Book[]>> {
    return this.http.get<BaseResponse<Book[]>>(`${this.apiUrl}/course/${courseId}`);
  }

  createBook(book: CreateBookRequest): Observable<BaseResponse<Book>> {
    return this.http.post<BaseResponse<Book>>(`${this.apiUrl}`, book);
  }

  updateBook(id: number, book: UpdateBookRequest): Observable<BaseResponse<Book>> {
    return this.http.put<BaseResponse<Book>>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${id}`);
  }

  addBookToCourse(bookId: number, courseId: number): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${bookId}/course/${courseId}`, {});
  }

  removeBookFromCourse(bookId: number, courseId: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${bookId}/course/${courseId}`);
  }
} 