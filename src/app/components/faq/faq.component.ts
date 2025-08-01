import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatExpansionModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  faqItems = [
    {
      question: 'Как зарегистрироваться на платформе?',
      answer: 'Нажмите кнопку "Регистрация" на главной странице, заполните форму и подтвердите email.'
    },
    {
      question: 'Можно ли изменить пароль?',
      answer: 'Да, вы можете изменить пароль в разделе "Профиль" в настройках аккаунта.'
    },
    {
      question: 'Как получить доступ к курсам?',
      answer: 'После регистрации и входа в систему вы получите доступ ко всем доступным курсам.'
    },
    {
      question: 'Что делать, если забыл пароль?',
      answer: 'Используйте функцию восстановления пароля на странице входа в систему.'
    },
    {
      question: 'Как связаться с технической поддержкой?',
      answer: 'Вы можете написать нам на email или использовать форму обратной связи.'
    }
  ];
} 