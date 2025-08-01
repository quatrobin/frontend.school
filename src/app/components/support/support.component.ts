import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  supportInfo = {
    email: 'support@school-knowledge.ru',
    phone: '+7 (495) 123-45-67',
    workingHours: 'Пн-Пт: 9:00 - 18:00',
    responseTime: 'В течение 24 часов'
  };
} 