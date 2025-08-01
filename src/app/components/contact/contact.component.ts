import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactInfo = {
    address: 'г. Москва, ул. Образования, д. 1',
    phone: '+7 (495) 123-45-67',
    email: 'info@school-knowledge.ru',
    workingHours: 'Пн-Пт: 9:00 - 18:00'
  };
} 