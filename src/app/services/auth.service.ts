import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UserProfile,
  Role
} from '../models/user.model';
import { BaseResponse } from '../models/base-response.model';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private platformId = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    // Загружаем пользователя из cookies при инициализации
    this.loadUserFromStorage();
  }

  register(request: RegisterRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<BaseResponse<AuthResponse>> {
    console.log('AuthService.login called with:', request);
    return this.http.post<BaseResponse<AuthResponse>>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          console.log('AuthService.login response:', response);
          if (response.success && response.data) {
            console.log('AuthService.login: Saving token and user');
            this.setToken(response.data.token);
            this.setCurrentUser(response.data);
          }
        })
      );
  }

  logout(): void {
    this.cookieService.deleteCookie('token');
    this.cookieService.deleteCookie('user');
    this.currentUserSubject.next(null);
  }

  changePassword(request: ChangePasswordRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/change-password`, request);
  }

  getProfile(): Observable<BaseResponse<UserProfile>> {
    return this.http.get<BaseResponse<UserProfile>>(`${this.apiUrl}/profile`);
  }

  getRoles(): Observable<BaseResponse<Role[]>> {
    return this.http.get<BaseResponse<Role[]>>(`${this.apiUrl}/role`);
  }

  getToken(): string | null {
    const token = this.cookieService.getCookie('token');
    console.log('AuthService.getToken: Token found:', !!token);
    return token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Проверяем срок действия токена
    try {
      const payload = this.parseJwt(token);
      const expirationTime = payload.exp * 1000; // конвертируем в миллисекунды
      const currentTime = Date.now();
      
      if (currentTime >= expirationTime) {
        console.log('AuthService.isAuthenticated: Token expired');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('AuthService.isAuthenticated: Error parsing token:', error);
      this.logout();
      return false;
    }
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  getTokenInfo(): { isValid: boolean; expiresAt?: Date; issuedAt?: Date } {
    const token = this.getToken();
    if (!token) {
      return { isValid: false };
    }

    try {
      const payload = this.parseJwt(token);
      const expirationTime = new Date(payload.exp * 1000);
      const issuedAt = new Date(payload.iat * 1000);
      const currentTime = new Date();

      return {
        isValid: currentTime < expirationTime,
        expiresAt: expirationTime,
        issuedAt: issuedAt
      };
    } catch (error) {
      console.error('Error parsing token info:', error);
      return { isValid: false };
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  isTeacher(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Преподаватель';
  }

  isStudent(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Студент';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Администратор';
  }

  public setToken(token: string): void {
    console.log('AuthService.setToken called with:', token);
    this.cookieService.setCookie('token', token, 7); // Сохраняем на 7 дней
    console.log('AuthService.setToken: Token saved to cookies');
    
    // Проверяем, что токен сохранился
    setTimeout(() => {
      const savedToken = this.cookieService.getCookie('token');
      console.log('AuthService.setToken: Verification - token saved:', !!savedToken);
    }, 100);
  }

  public setCurrentUser(authResponse: AuthResponse): void {
    console.log('AuthService.setCurrentUser called with:', authResponse);
    const user: UserProfile = authResponse.user;
    this.cookieService.setCookie('user', JSON.stringify(user), 9); // Сохраняем на 7 дней
    console.log('AuthService.setCurrentUser: User saved to cookies');
    this.currentUserSubject.next(user);
  }

  public loadUserFromStorage(): void {
    try {
      const token = this.cookieService.getCookie('token');
      const userStr = this.cookieService.getCookie('user');
      
      console.log('AuthService.loadUserFromStorage: Token:', !!token, 'User:', !!userStr);
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          this.currentUserSubject.next(user);
          console.log('AuthService.loadUserFromStorage: User loaded from cookies');
        } catch (error) {
          console.error('Error parsing user from cookies:', error);
          this.logout();
        }
      } else {
        console.log('AuthService.loadUserFromStorage: No token or user found');
      }
    } catch (error) {
      console.error('AuthService.loadUserFromStorage: Error loading from storage:', error);
    }
  }
}
