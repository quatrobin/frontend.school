import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookService } from '../../../services/book.service';
import { CourseService } from '../../../services/course.service';
import { CreateBookRequest } from '../../../models/book.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss']
})
export class CreateBookComponent implements OnInit {
  bookForm: FormGroup;
  courses: Course[] = [];
  loadingCourses = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      isbn: ['', [Validators.maxLength(50)]],
      publicationYear: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      publisher: ['', [Validators.maxLength(100)]],
      pages: ['', [Validators.required, Validators.min(1)]],
      language: ['Русский', [Validators.maxLength(20)]],
      courseIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
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
    if (this.bookForm.valid) {
      this.submitting = true;
      const bookData: CreateBookRequest = this.bookForm.value;

      this.bookService.createBook(bookData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Книга успешно создана', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/books']);
          } else {
            this.snackBar.open(response.message || 'Ошибка создания книги', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка создания книги', 'Закрыть', { duration: 3000 });
          console.error('Error creating book:', error);
        },
        complete: () => {
          this.submitting = false;
          this.chDet.detectChanges();
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}
