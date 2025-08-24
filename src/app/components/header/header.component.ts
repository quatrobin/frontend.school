import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UserProfile | null>;
  isAuthenticated$: Observable<boolean>;
  isTeacher$: Observable<boolean>;
  isStudent$: Observable<string>; // Баг: неправильная типизация
  isMobileMenuOpen = false;
  isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.currentUser$.pipe(
      map(user => !!user && this.authService.isAuthenticated())
    );
    this.isTeacher$ = this.currentUser$.pipe(
      map(user => user?.role === 'Преподаватель')
    );
    this.isStudent$ = this.currentUser$.pipe(
      map(user => user?.role === 'Студент')
    );
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 1000;
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }

  goToAssignments(): void {
    this.router.navigate(['/assignments']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  onOverlayClick(): void {
    this.closeMobileMenu();
  }
} 