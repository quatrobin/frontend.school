import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  news: any[] = [];
  loading = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Заглушка для новостей
    setTimeout(() => {
      this.news = [
        {
          id: 1,
          title: 'Новые курсы по программированию',
          content: 'Мы запустили новые курсы по программированию на Python и JavaScript. Присоединяйтесь к нам!',
          date: new Date('2024-01-15'),
          category: 'Образование'
        },
        {
          id: 2,
          title: 'Обновление платформы',
          content: 'Мы обновили нашу образовательную платформу с новыми функциями и улучшенным интерфейсом.',
          date: new Date('2024-01-10'),
          category: 'Технологии'
        },
        {
          id: 3,
          title: 'Достижения наших студентов',
          content: 'Наши студенты показали отличные результаты на международных конкурсах программирования.',
          date: new Date('2024-01-05'),
          category: 'Достижения'
        }
      ];
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }
} 