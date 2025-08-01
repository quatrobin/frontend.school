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
import { CourseService } from '../../../services/course.service';
import { Course, CreateCourseRequest } from '../../../models/course.model';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {
  courseForm: FormGroup;
  loading = false;
  submitting = false;
  courseId: number = 0;
  course: Course | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
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
          this.courseForm.patchValue({
            name: this.course.name,
            description: this.course.description || ''
          });
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

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.submitting = true;
      const courseData: CreateCourseRequest = this.courseForm.value;
      this.courseService.updateCourse(this.courseId, courseData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Курс успешно обновлен', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/courses']);
          } else {
            this.snackBar.open(response.message || 'Ошибка обновления курса', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка обновления курса', 'Закрыть', { duration: 3000 });
          console.error('Error updating course:', error);
        },
        complete: () => {
          this.submitting = false;
          this.chDet.detectChanges();
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }
}
