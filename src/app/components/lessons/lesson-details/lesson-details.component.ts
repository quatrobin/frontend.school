import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LessonService } from '../../../services/lesson.service';
import { AuthService } from '../../../services/auth.service';
import { Lesson } from '../../../models/lesson.model';

@Component({
  selector: 'app-lesson-details',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.scss']
})
export class LessonDetailsComponent implements OnInit {
  lesson: Lesson | null = null;
  loading = false;
  isTeacher = false;
  lessonId: number = 0;

  constructor(
    private lessonService: LessonService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.lessonId = Number(this.route.snapshot.paramMap.get('id'));
    this.isTeacher = this.authService.isTeacher();
    if (this.lessonId) {
      this.loadLesson();
    }
  }

  loadLesson(): void {
    this.loading = true;
    this.lessonService.getLessonById(this.lessonId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lesson = response.data;
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

  editLesson(): void {
    this.router.navigate(['/lessons', this.lessonId, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/lessons']);
  }
}
