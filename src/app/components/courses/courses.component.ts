import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  loading = false;
  isTeacher = false;
  private destroy$ = new Subject<void>();

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.isTeacher = this.authService.isTeacher();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCourses(): void {
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
    });

    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });

        if (response.success && response.data) {
          this.courses = response.data;
        } else {
          this.snackBar.open(response.message || 'Ошибка загрузки курсов', 'Закрыть', { duration: 3000 });
        }
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
        this.snackBar.open('Ошибка загрузки курсов', 'Закрыть', { duration: 3000 });
      }
    });
  }

  createCourse(): void {
    this.router.navigate(['/courses/create']);
  }

  goToCourseDetails(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  enrollInCourse(courseId: number): void {
    alert('Запись на курс пока не реализована');
  }
} 