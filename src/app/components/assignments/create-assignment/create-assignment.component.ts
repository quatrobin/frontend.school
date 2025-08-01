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
import { AssignmentService } from '../../../services/assignment.service';
import { CourseService } from '../../../services/course.service';
import { CreateAssignmentRequest } from '../../../models/assignment.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-create-assignment',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.scss']
})
export class CreateAssignmentComponent implements OnInit {
  assignmentForm: FormGroup;
  courses: Course[] = [];
  loadingCourses = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {
    this.assignmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      courseId: ['', Validators.required],
      dueDate: ['', Validators.required],
      maxScore: ['', [Validators.required, Validators.min(1)]]
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
    if (this.assignmentForm.valid) {
      this.submitting = true;
      const assignmentData: CreateAssignmentRequest = this.assignmentForm.value;
      this.assignmentService.createAssignment(assignmentData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Задание успешно создано', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/assignments']);
          } else {
            this.snackBar.open(response.message || 'Ошибка создания задания', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка создания задания', 'Закрыть', { duration: 3000 });
          console.error('Error creating assignment:', error);
        },
        complete: () => {
          this.submitting = false;
          this.chDet.detectChanges();
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/assignments']);
  }
}
