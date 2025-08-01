import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatExpansionModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  helpSections = [
    {
      title: 'Как начать обучение?',
      content: 'Для начала обучения зарегистрируйтесь на платформе, выберите интересующий вас курс и начните изучение материалов.'
    },
    {
      title: 'Как отправить задание?',
      content: 'Перейдите в раздел "Задания", выберите нужное задание и нажмите кнопку "Отправить". Вы можете прикрепить файл или написать ответ в текстовом поле.'
    },
    {
      title: 'Как связаться с преподавателем?',
      content: 'Вы можете связаться с преподавателем через систему сообщений на платформе или отправить email.'
    },
    {
      title: 'Как отследить свой прогресс?',
      content: 'Ваш прогресс отображается в личном кабинете. Там вы можете увидеть пройденные уроки, выполненные задания и полученные оценки.'
    }
  ];
} 