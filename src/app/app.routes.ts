import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { IsLoggedInGuard } from './guards/is-logged.guard';
import { hasAccess } from './guards/has-access.guard';
import { DefaultAppLayoutComponent } from './components/default-app-layout/default-app-layout.component';
import { ClassDetailsComponent } from './components/class/class-details/class-details.component';
import { ClassListComponent } from './components/class/class-list/class-list.component';

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
      {
        path: 'home',
        component: ClassListComponent
      },
      {
        path: 'class/new',
        component: ClassDetailsComponent
      },
      {
        path: 'class/edit/:id',
        component: ClassDetailsComponent
      }
    ]
  }
];
