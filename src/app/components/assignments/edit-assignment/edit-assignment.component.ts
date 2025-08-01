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
import { AssignmentService } from '../../../services/assignment.service';
import { CourseService } from '../../../services/course.service';
import { Assignment, CreateAssignmentRequest } from '../../../models/assignment.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss']
})
export class EditAssignmentComponent implements OnInit {
  assignmentForm: FormGroup;
  courses: Course[] = [];
  loading = false;
  loadingCourses = false;
  submitting = false;
  assignmentId: number = 0;
  assignment: Assignment | null = null;

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.assignmentId) {
      this.loadAssignment();
      this.loadCourses();
    }
  }

  loadAssignment(): void {
    this.loading = true;
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.assignment = response.data;
          this.assignmentForm.patchValue({
            title: this.assignment.title,
            description: this.assignment.description || '',
            courseId: this.assignment.courseId,
            dueDate: this.assignment.dueDate.split('T')[0],
            maxScore: this.assignment.maxScore
          });
        } else {
          this.snackBar.open(response.message || 'Задание не найдено', 'Закрыть', { duration: 3000 });
          this.router.navigate(['/assignments']);
        }
      },
      error: (error) => {
        this.snackBar.open('Ошибка загрузки задания', 'Закрыть', { duration: 3000 });
        console.error('Error loading assignment:', error);
        this.router.navigate(['/assignments']);
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
    if (this.assignmentForm.valid) {
      this.submitting = true;
      const assignmentData: CreateAssignmentRequest = this.assignmentForm.value;
      this.assignmentService.updateAssignment(this.assignmentId, assignmentData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Задание успешно обновлено', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/assignments']);
          } else {
            this.snackBar.open(response.message || 'Ошибка обновления задания', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка обновления задания', 'Закрыть', { duration: 3000 });
          console.error('Error updating assignment:', error);
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
