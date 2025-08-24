import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private destroy$ = new Subject<void>();
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    console.log('onSubmit called');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form value:', this.loginForm.value);
    
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Calling auth service with:', { email, password });
      
      // Используем setTimeout для избежания ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.loading = true;
        this.cdr.detectChanges();
      });
      
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          
          setTimeout(() => {
            this.loading = false;
            this.cdr.detectChanges();
          });
          
          if (response.success && response.data) {
            // Перенаправляем на dashboard
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open(response.message || 'Ошибка входа', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          
          setTimeout(() => {
            this.loading = false;
            this.cdr.detectChanges();
          });
          
          this.snackBar.open('Ошибка входа', 'Закрыть', { duration: 3000 });
        }
      });
    } else {
      console.log('Form is invalid');
      console.log('Form errors:', this.loginForm.errors);
      console.log('Email errors:', this.loginForm.get('email')?.errors);
      console.log('Password errors:', this.loginForm.get('password')?.errors);
    }
  }
}
