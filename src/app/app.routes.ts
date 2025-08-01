import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { teacherGuard } from './guards/teacher.guard';
import { studentGuard } from './guards/student.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CreateCourseComponent } from './components/courses/create-course/create-course.component';
import { CourseDetailsComponent } from './components/courses/course-details/course-details.component';
import { EditCourseComponent } from './components/courses/edit-course/edit-course.component';
import { AssignmentsComponent } from './components/assignments/assignments.component';
import { CreateAssignmentComponent } from './components/assignments/create-assignment/create-assignment.component';
import { AssignmentDetailsComponent } from './components/assignments/assignment-details/assignment-details.component';
import { EditAssignmentComponent } from './components/assignments/edit-assignment/edit-assignment.component';
import { SubmitAssignmentComponent } from './components/submissions/submit-assignment/submit-assignment.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { CreateLessonComponent } from './components/lessons/create-lesson/create-lesson.component';
import { LessonDetailsComponent } from './components/lessons/lesson-details/lesson-details.component';
import { EditLessonComponent } from './components/lessons/edit-lesson/edit-lesson.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { BooksComponent } from './components/books/books.component';
import { CreateBookComponent } from './components/books/create-book/create-book.component';
import { BookDetailsComponent } from './components/books/book-details/book-details.component';
import { EditBookComponent } from './components/books/edit-book/edit-book.component';
import { AboutComponent } from './components/about/about.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { NewsComponent } from './components/news/news.component';
import { ContactComponent } from './components/contact/contact.component';
import { HelpComponent } from './components/help/help.component';
import { FaqComponent } from './components/faq/faq.component';
import { SupportComponent } from './components/support/support.component';
import { FeedbackComponent } from './components/feedback/feedback.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [authGuard] },
  { path: 'courses/create', component: CreateCourseComponent, canActivate: [teacherGuard] },
  { path: 'courses/:id', component: CourseDetailsComponent, canActivate: [authGuard] },
  { path: 'courses/:id/edit', component: EditCourseComponent, canActivate: [teacherGuard] },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [authGuard] },
  { path: 'assignments/create', component: CreateAssignmentComponent, canActivate: [teacherGuard] },
  { path: 'assignments/:id', component: AssignmentDetailsComponent, canActivate: [authGuard] },
  { path: 'assignments/:id/edit', component: EditAssignmentComponent, canActivate: [teacherGuard] },
  { path: 'assignments/:id/submit', component: SubmitAssignmentComponent, canActivate: [studentGuard] },
  { path: 'lessons', component: LessonsComponent, canActivate: [authGuard] },
  { path: 'lessons/create', component: CreateLessonComponent, canActivate: [teacherGuard] },
  { path: 'lessons/:id', component: LessonDetailsComponent, canActivate: [authGuard] },
  { path: 'lessons/:id/edit', component: EditLessonComponent, canActivate: [teacherGuard] },
  { path: 'submissions', component: SubmissionsComponent, canActivate: [teacherGuard] },
  { path: 'books', component: BooksComponent, canActivate: [authGuard] },
  { path: 'books/create', component: CreateBookComponent, canActivate: [teacherGuard] },
  { path: 'books/:id', component: BookDetailsComponent, canActivate: [authGuard] },
  { path: 'books/:id/edit', component: EditBookComponent, canActivate: [teacherGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'news', component: NewsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'help', component: HelpComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'support', component: SupportComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: '**', redirectTo: '/dashboard' }
];
