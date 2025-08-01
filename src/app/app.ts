import { Component } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutComponent } from './components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSnackBarModule, LayoutComponent],
  template: `
    <app-layout></app-layout>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'school-frontend';
}
