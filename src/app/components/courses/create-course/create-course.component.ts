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
import { CourseService } from '../../../services/course.service';
import { CreateCourseRequest } from '../../../models/course.model';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {
  courseForm: FormGroup;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.submitting = true;
      const courseData: CreateCourseRequest = this.courseForm.value;
      this.courseService.createCourse(courseData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Курс успешно создан', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/courses']);
          } else {
            this.snackBar.open(response.message || 'Ошибка создания курса', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка создания курса', 'Закрыть', { duration: 3000 });
          console.error('Error creating course:', error);
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
