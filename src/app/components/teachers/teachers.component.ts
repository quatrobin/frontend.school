import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {
  teachers: UserProfile[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Здесь будет вызов API для загрузки преподавателей
    // Пока используем заглушку
    setTimeout(() => {
      this.teachers = [
        {
          id: 1,
          email: 'teacher1@example.com',
          firstName: 'Анна',
          lastName: 'Петрова',
          role: 'Преподаватель'
        },
        {
          id: 2,
          email: 'teacher2@example.com',
          firstName: 'Иван',
          lastName: 'Сидоров',
          role: 'Преподаватель'
        }
      ];
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }
} 