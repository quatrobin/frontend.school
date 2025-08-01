import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubmissionService } from '../../../services/submission.service';
import { AssignmentService } from '../../../services/assignment.service';
import { CreateSubmissionRequest } from '../../../models/submission.model';
import { Assignment } from '../../../models/assignment.model';

@Component({
  selector: 'app-submit-assignment',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule
  ],
  templateUrl: './submit-assignment.component.html',
  styleUrls: ['./submit-assignment.component.scss']
})
export class SubmitAssignmentComponent implements OnInit {
  submissionForm: FormGroup;
  assignment: Assignment | null = null;
  loading = false;
  submitting = false;
  assignmentId: number = 0;

  constructor(
    private fb: FormBuilder,
    private submissionService: SubmissionService,
    private assignmentService: AssignmentService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {
    this.submissionForm = this.fb.group({
      content: ['', [Validators.maxLength(2000)]],
      fileUrl: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.assignmentId) {
      this.loadAssignment();
    }
  }

  loadAssignment(): void {
    this.loading = true;
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.assignment = response.data;
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

  onSubmit(): void {
    if (this.submissionForm.valid) {
      this.submitting = true;
      const submissionData: CreateSubmissionRequest = {
        assignmentId: this.assignmentId,
        content: this.submissionForm.get('content')?.value || '',
        fileUrl: this.submissionForm.get('fileUrl')?.value || ''
      };

      this.submissionService.createSubmission(submissionData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Задание успешно отправлено', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/assignments']);
          } else {
            this.snackBar.open(response.message || 'Ошибка отправки задания', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка отправки задания', 'Закрыть', { duration: 3000 });
          console.error('Error submitting assignment:', error);
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
