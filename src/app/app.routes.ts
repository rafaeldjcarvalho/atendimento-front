import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { IsLoggedInGuard } from './guards/is-logged.guard';
import { hasAccess } from './guards/has-access.guard';
import { DefaultAppLayoutComponent } from './components/default-app-layout/default-app-layout.component';
import { ClassListComponent } from './pages/class/class-list/class-list.component';
import { ClassDetailsComponent } from './pages/class/class-details/class-details.component';
import { ClassResolver } from './guards/class.resolver';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'user',
    component: DefaultAppLayoutComponent,
    //canActivate: [IsLoggedInGuard],
    children: [
      { path: 'home', component: ClassListComponent },
      { path: 'class/new', component: ClassDetailsComponent, resolve: { classes: ClassResolver } },
      { path: 'class/edit/:id', component: ClassDetailsComponent, resolve: { classes: ClassResolver }}
    ]
  }
];
