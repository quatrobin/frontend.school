import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmissionService } from '../../services/submission.service';
import { AuthService } from '../../services/auth.service';
import { Submission } from '../../models/submission.model';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss']
})
export class SubmissionsComponent implements OnInit {
  submissions: Submission[] = [];
  loading = false;
  isTeacher = false;
  isStudent = false;
  currentAssignmentId: number | null = null;

  constructor(
    private submissionService: SubmissionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isTeacher = this.authService.isTeacher();
    this.isStudent = this.authService.isStudent();
    
    console.log('SubmissionsComponent: User roles - Teacher:', this.isTeacher, 'Student:', this.isStudent);
    console.log('SubmissionsComponent: Is authenticated:', this.authService.isAuthenticated());
    console.log('SubmissionsComponent: Current user:', this.authService.getCurrentUser());
    
    // Проверяем query параметры для assignmentId
    this.route.queryParams.subscribe(params => {
      const assignmentId = params['assignmentId'];
      if (assignmentId) {
        this.currentAssignmentId = Number(assignmentId);
        console.log('SubmissionsComponent: Assignment ID from query params:', this.currentAssignmentId);
        this.loadSubmissionsByAssignment(this.currentAssignmentId);
      } else {
        this.loadSubmissions();
      }
    });
  }

  loadSubmissions(): void {
    this.loading = true;
    this.cdr.detectChanges();

    if (this.isTeacher) {
      // Для преподавателей показываем сообщение о выборе задания
      console.log('Teacher: No endpoint for all submissions, showing assignment selection message');
      this.loading = false;
      this.cdr.detectChanges();
    } else if (this.isStudent) {
      // Для студентов загружаем их отправки
      const currentUser = this.authService.getCurrentUser();
      console.log('Current user for student:', currentUser);
      if (currentUser && currentUser.id) {
        console.log('Loading submissions for student ID:', currentUser.id);
        this.submissionService.getSubmissionsByStudent(currentUser.id).subscribe({
          next: (response) => {
            console.log('Student submissions response:', response);
            if (response.success && response.data) {
              this.submissions = response.data;
              console.log('Loaded student submissions:', this.submissions);
            } else {
              console.error('API returned error for student:', response.message);
              this.snackBar.open(response.message || 'Ошибка загрузки отправок', 'Закрыть', {duration: 3000});
            }
          },
          error: (error) => {
            console.error('Error loading student submissions:', error);
            this.snackBar.open('Ошибка загрузки отправок. Проверьте консоль для деталей.', 'Закрыть', {duration: 5000});
          },
          complete: () => {
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        console.error('No current user found for student');
        this.snackBar.open('Ошибка: пользователь не найден', 'Закрыть', {duration: 3000});
        this.loading = false;
        this.cdr.detectChanges();
      }
    } else {
      console.log('User is not teacher or student');
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadSubmissionsByAssignment(assignmentId: number): void {
    this.loading = true;
    console.log('Loading submissions for assignment ID:', assignmentId);

    this.submissionService.getSubmissionsByAssignment(assignmentId).subscribe({
      next: (response) => {
        console.log('Assignment submissions response:', response);
        if (response.success && response.data) {
          this.submissions = response.data;
          console.log('Loaded assignment submissions:', this.submissions);
        } else {
          console.error('API returned error for assignment:', response.message);
          this.snackBar.open(response.message || 'Ошибка загрузки отправок', 'Закрыть', {duration: 3000});
        }
      },
      error: (error) => {
        console.error('Error loading assignment submissions:', error);
        this.snackBar.open('Ошибка загрузки отправок. Проверьте консоль для деталей.', 'Закрыть', {duration: 5000});
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToSubmissionDetails(id: number): void {
    this.router.navigate(['/submissions', id]);
  }

  goToAssignments(): void {
    this.router.navigate(['/assignments']);
  }
}
