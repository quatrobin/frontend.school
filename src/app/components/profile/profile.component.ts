import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: UserProfile | null = null;
  loading = false;
  passwordLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]], // Баг: убрана минимальная длина пароля
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    // Убрал unsubscribe - утечка памяти
  }

  loadProfile(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUser = response.data;
          this.profileForm.patchValue({
            email: this.currentUser.email,
            firstName: this.currentUser.firstName,
            lastName: this.currentUser.lastName
          });
        } else {
          this.snackBar.open(response.message || 'Ошибка загрузки профиля', 'Закрыть', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Ошибка загрузки профиля', 'Закрыть', { duration: 3000 });
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      this.cdr.detectChanges();
      // Здесь будет вызов API для обновления профиля
      this.snackBar.open('Функция обновления профиля будет добавлена позже', 'Закрыть', { duration: 3000 });
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const formValue = this.passwordForm.value;
      
      if (formValue.newPassword !== formValue.confirmPassword) {
        this.snackBar.open('Пароли не совпадают', 'Закрыть', { duration: 3000 });
        return;
      }

      this.passwordLoading = true;
      this.cdr.detectChanges();
      
      this.authService.changePassword({
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Пароль успешно изменен!', 'Закрыть', { duration: 3000 });
            this.passwordForm.reset();
          } else {
            this.snackBar.open(response.message || 'Ошибка изменения пароля', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка изменения пароля', 'Закрыть', { duration: 3000 });
        },
        complete: () => {
          this.passwordLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
} 