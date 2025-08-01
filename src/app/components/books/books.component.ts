import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-books',
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
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  loading = false;
  isTeacher = false;
  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.isTeacher = this.authService.isTeacher();
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBooks(): void {
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
    });

    this.bookService.getAllBooks().subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });

        if (response.success && response.data) {
          this.books = response.data;
        } else {
          this.snackBar.open(response.message || 'Ошибка загрузки книг', 'Закрыть', { duration: 3000 });
        }
      },
      error: (error: any) => {
        console.error('Error loading books:', error);
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
        this.snackBar.open('Ошибка загрузки книг', 'Закрыть', { duration: 3000 });
      }
    });
  }

  createBook(): void {
    this.router.navigate(['/books/create']);
  }

  goToBookDetails(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }

  editBook(bookId: number): void {
    // TODO: реализовать переход на страницу редактирования
    this.router.navigate(['/books', bookId, 'edit']);
  }
  deleteBook(bookId: number): void {
    // TODO: реализовать удаление книги
    alert('Удаление книги пока не реализовано');
  }
} 