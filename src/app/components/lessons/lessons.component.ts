import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, OnDestroy {
  lessons: Lesson[] = [];
  loading = false;
  isTeacher = false;
  private destroy$ = new Subject<void>();

  constructor(
    private lessonService: LessonService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.isTeacher = this.authService.isTeacher();
  }

  ngOnInit(): void {
    this.loadLessons();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLessons(): void {
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
    });

    this.lessonService.getAllLessons().subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });

        if (response.success && response.data) {
          this.lessons = response.data;
        } else {
          this.snackBar.open(response.message || 'Ошибка загрузки уроков', 'Закрыть', { duration: 3000 });
        }
      },
      error: (error: any) => {
        console.error('Error loading lessons:', error);
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
        this.snackBar.open('Ошибка загрузки уроков', 'Закрыть', { duration: 3000 });
      }
    });
  }

  createLesson(): void {
    this.router.navigate(['/lessons/create']);
  }

  goToLessonDetails(lessonId: number): void {
    this.router.navigate(['/lessons', lessonId]);
  }
} 