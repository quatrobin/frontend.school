import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  loading = false;
  isTeacher = false;
  courseId: number = 0;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.isTeacher = this.authService.isTeacher();
    if (this.courseId) {
      this.loadCourse();
    }
  }

  loadCourse(): void {
    this.loading = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.course = response.data;
        } else {
          this.snackBar.open(response.message || 'Курс не найден', 'Закрыть', { duration: 3000 });
          this.router.navigate(['/courses']);
        }
      },
      error: (error) => {
        this.snackBar.open('Ошибка загрузки курса', 'Закрыть', { duration: 3000 });
        console.error('Error loading course:', error);
        this.router.navigate(['/courses']);
      },
      complete: () => {
        this.loading = false;
        this.chDet.detectChanges();
      }
    });
  }

  editCourse(): void {
    this.router.navigate(['/courses', this.courseId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
