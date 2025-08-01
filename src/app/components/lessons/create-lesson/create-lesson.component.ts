import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LessonService } from '../../../services/lesson.service';
import { CourseService } from '../../../services/course.service';
import { CreateLessonRequest } from '../../../models/lesson.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-create-lesson',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.scss']
})
export class CreateLessonComponent implements OnInit {
  lessonForm: FormGroup;
  courses: Course[] = [];
  loadingCourses = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {
    this.lessonForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      courseId: ['', Validators.required],
      lessonDate: ['', Validators.required],
      durationMinutes: [90, [Validators.required, Validators.min(15), Validators.max(480)]],
      materials: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.courses = response.data;
        } else {
          this.snackBar.open(response.message || 'Ошибка загрузки курсов', 'Закрыть', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Ошибка загрузки курсов', 'Закрыть', { duration: 3000 });
        console.error('Error loading courses:', error);
      },
      complete: () => {
        this.loadingCourses = false;
        this.chDet.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.lessonForm.valid) {
      this.submitting = true;
      const lessonData: CreateLessonRequest = this.lessonForm.value;
      this.lessonService.createLesson(lessonData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Урок успешно создан', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/lessons']);
          } else {
            this.snackBar.open(response.message || 'Ошибка создания урока', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка создания урока', 'Закрыть', { duration: 3000 });
          console.error('Error creating lesson:', error);
        },
        complete: () => {
          this.submitting = false;
          this.chDet.detectChanges();
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/lessons']);
  }
}
