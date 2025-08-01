import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../../models/assignment.model';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-assignments',
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
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit, OnDestroy {
  assignments: Assignment[] = [];
  loading = false;
  isTeacher = false;
  private destroy$ = new Subject<void>();

  constructor(
    private assignmentService: AssignmentService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.isTeacher = this.authService.isTeacher();
  }

  ngOnInit(): void {
    this.loadAssignments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAssignments(): void {
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
    });

    this.assignmentService.getMyAssignments().subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });

        if (response.success && response.data) {
          this.assignments = response.data;
        } else {
          this.snackBar.open(response.message || 'Ошибка загрузки заданий', 'Закрыть', { duration: 3000 });
        }
      },
      error: (error: any) => {
        console.error('Error loading assignments:', error);
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
        this.snackBar.open('Ошибка загрузки заданий', 'Закрыть', { duration: 3000 });
      }
    });
  }

  createAssignment(): void {
    this.router.navigate(['/assignments/create']);
  }

  goToAssignmentDetails(assignmentId: number): void {
    this.router.navigate(['/assignments', assignmentId]);
  }

  goToSubmissions(assignmentId: number): void {
    this.router.navigate(['/submissions'], { queryParams: { assignmentId: assignmentId } });
  }

  getStatusClass(assignment: Assignment): string {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    if (dueDate < now) {
      return 'overdue';
    } else if (dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return 'due-soon';
    }
    return 'normal';
  }

  getStatusText(assignment: Assignment): string {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    
    if (dueDate < now) {
      return 'Просрочено';
    } else if (dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return 'Скоро дедлайн';
    }
    return 'Время есть';
  }
} 