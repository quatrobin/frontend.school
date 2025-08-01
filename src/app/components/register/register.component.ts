import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Role } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  roles: Role[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRoles(): void {
    this.authService.getRoles().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.roles = response.data;
        }
      },
      error: (error) => {
        this.snackBar.open('Ошибка загрузки ролей', 'Закрыть', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    console.log('Register onSubmit called');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form value:', this.registerForm.value);
    
    if (this.registerForm.valid) {
      const { email, firstName, lastName, password, role } = this.registerForm.value;
      console.log('Calling register service with:', { email, firstName, lastName, role });
      
      // Используем setTimeout для избежания ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.loading = true;
        this.cdr.detectChanges();
      });
      
      this.authService.register({ email, firstName, lastName, password, role }).subscribe({
        next: (response) => {
          console.log('Register response:', response);
          
          setTimeout(() => {
            this.loading = false;
            this.cdr.detectChanges();
          });
          
          if (response.success) {
            this.snackBar.open('Регистрация успешна! Теперь вы можете войти.', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open(response.message || 'Ошибка регистрации', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Register error:', error);
          
          setTimeout(() => {
            this.loading = false;
            this.cdr.detectChanges();
          });
          
          this.snackBar.open('Ошибка регистрации', 'Закрыть', { duration: 3000 });
        }
      });
    } else {
      console.log('Form is invalid');
      console.log('Form errors:', this.registerForm.errors);
    }
  }
} 