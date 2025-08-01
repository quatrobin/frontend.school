import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressSpinnerModule, MatDialogModule
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  loading = false;
  isTeacher = false;
  bookId: number = 0;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private chDet: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.isTeacher = this.authService.isTeacher();

    if (this.bookId) {
      this.loadBook();
    }
  }

  loadBook(): void {
    this.loading = true;
    this.bookService.getBookById(this.bookId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.book = response.data;
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

  editBook(): void {
    this.router.navigate(['/books', this.bookId, 'edit']);
  }

  deleteBook(): void {
    if (confirm('Вы уверены, что хотите удалить эту книгу?')) {
      this.bookService.deleteBook(this.bookId).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Книга успешно удалена', 'Закрыть', { duration: 3000 });
            this.router.navigate(['/books']);
          } else {
            this.snackBar.open(response.message || 'Ошибка удаления книги', 'Закрыть', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка удаления книги', 'Закрыть', { duration: 3000 });
          console.error('Error deleting book:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ru-RU');
  }
}
