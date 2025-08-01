import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../../services/assignment.service';
import { AuthService } from '../../../services/auth.service';
import { Assignment } from '../../../models/assignment.model';

@Component({
  selector: 'app-assignment-details',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.scss']
})
export class AssignmentDetailsComponent implements OnInit {
  assignment: Assignment | null = null;
  loading = false;
  isTeacher = false;
  isStudent = false;
  assignmentId: number = 0;

  constructor(
    private assignmentService: AssignmentService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.isTeacher = this.authService.isTeacher();
    this.isStudent = this.authService.isStudent();
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

  editAssignment(): void {
    this.router.navigate(['/assignments', this.assignmentId, 'edit']);
  }

  submitAssignment(): void {
    this.router.navigate(['/assignments', this.assignmentId, 'submit']);
  }

  goBack(): void {
    this.router.navigate(['/assignments']);
  }
}
