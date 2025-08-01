import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookService } from '../../../services/book.service';
import { CourseService } from '../../../services/course.service';
import { UpdateBookRequest, Book } from '../../../models/book.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-edit-book',
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
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit {
  bookForm: FormGroup;
  book: Book | null = null;
  courses: Course[] = [];
  loading = false;
  loadingCourses = false;
  submitting = false;
  bookId: number = 0;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.loadBook();
      this.loadCourses();
    }
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  loadBook(): void {
    this.loading = true;
    this.bookService.getBookById(this.bookId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.book = response.data;
          this.populateForm();
        } else {
          this.snackBar.open(response.message || 'Книга не найдена', 'Закрыть', { duration: 3000 });
          this.router.navigate(['/books']);
        }
      },
      error: (error) => {
        this.snackBar.open('Ошибка загрузки книги', 'Закрыть', { duration: 3000 });
        console.error('Error loading book:', error);
        this.router.navigate(['/books']);
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

  populateForm(): void {
    if (this.book) {
      this.bookForm.patchValue({
        title: this.book.title,
        author: this.book.author,
        description: this.book.description || '',
        isbn: this.book.isbn || '',
        publicationYear: this.book.publicationYear,
        publisher: this.book.publisher || '',
        pages: this.book.pages,
        language: this.book.language || 'Русский',
        courseIds: this.book.courses.map(course => course.id)
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.submitting = true;
      const bookData: UpdateBookRequest = this.bookForm.value;

      this.bookService.updateBook(this.bookId, bookData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Книга успешно обновлена', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/books']);
          } else {
            this.snackBar.open(response.message || 'Ошибка обновления книги', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка обновления книги', 'Закрыть', { duration: 3000 });
          console.error('Error updating book:', error);
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
