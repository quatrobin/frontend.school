import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LessonService } from '../../../services/lesson.service';
import { CourseService } from '../../../services/course.service';
import { Lesson, UpdateLessonRequest } from '../../../models/lesson.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-edit-lesson',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit {
  lessonForm: FormGroup;
  courses: Course[] = [];
  loading = false;
  loadingCourses = false;
  submitting = false;
  lessonId: number = 0;
  lesson: Lesson | null = null;

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.lessonId) {
      this.loadLesson();
      this.loadCourses();
    }
  }

  loadLesson(): void {
    this.loading = true;
    this.lessonService.getLessonById(this.lessonId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lesson = response.data;
          this.lessonForm.patchValue({
            title: this.lesson!.title,
            description: this.lesson!.description || '',
            courseId: this.lesson!.courseId,
            lessonDate: this.lesson!.lessonDate.split('T')[0],
            durationMinutes: this.lesson!.durationMinutes,
            materials: this.lesson!.materials || ''
          });
        } else {
          this.snackBar.open(response.message || 'Урок не найден', 'Закрыть', { duration: 3000 });
          this.router.navigate(['/lessons']);
        }
      },
      error: (error) => {
        this.snackBar.open('Ошибка загрузки урока', 'Закрыть', { duration: 3000 });
        console.error('Error loading lesson:', error);
        this.router.navigate(['/lessons']);
      },
      complete: () => {
        this.loading = false;
        this.chDet.detectChanges();
      }
    });
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
      const lessonData: UpdateLessonRequest = this.lessonForm.value;
      this.lessonService.updateLesson(this.lessonId, lessonData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Урок успешно обновлен', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/lessons']);
          } else {
            this.snackBar.open(response.message || 'Ошибка обновления урока', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка обновления урока', 'Закрыть', { duration: 3000 });
          console.error('Error updating lesson:', error);
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
