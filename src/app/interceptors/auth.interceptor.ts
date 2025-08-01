import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  console.log('AuthInterceptor: Processing request to:', req.url);
  
  // Проверяем, что токен действителен
  if (!authService.isAuthenticated()) {
    console.log('AuthInterceptor: Token invalid or expired, redirecting to login');
    // Здесь можно добавить редирект на страницу логина
    // Но пока просто не добавляем токен к запросу
    return next(req);
  }
  
  const token = authService.getToken();
  if (token) {
    console.log('AuthInterceptor: Adding token to request');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('AuthInterceptor: No token found');
  }
  
  return next(req);
}; 