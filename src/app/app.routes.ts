import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { IsLoggedInGuard } from './guards/is-logged.guard';
import { hasAccess } from './guards/has-access.guard';
import { DefaultAppLayoutComponent } from './components/default-app-layout/default-app-layout.component';
import { ClassListComponent } from './pages/class/class-list/class-list.component';
import { ClassDetailsComponent } from './pages/class/class-details/class-details.component';
import { ClassResolver } from './guards/class.resolver';
import { ClassPrincipalComponent } from './pages/class/class-principal/class-principal.component';
import { CalendarFormComponent } from './pages/class/calendar-form/calendar-form.component';
import { OrderFormComponent } from './pages/class/order-form/order-form.component';
import { OrderResolver } from './guards/resolvers/order.resolver';
import { ServiceFormComponent } from './pages/class/service-form/service-form.component';
import { ServiceResolver } from './guards/resolvers/service.resolver';
import { UserDetailsComponent } from './pages/user/user-details/user-details.component';
import { HomeComponent } from './pages/home/home/home.component';


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
      { path: 'home', component: HomeComponent },
      { path: 'classes', component: ClassListComponent },
      { path: 'edit/:id', component: UserDetailsComponent },
      { path: 'class/new', component: ClassDetailsComponent, resolve: { classes: ClassResolver } },
      { path: 'class/edit/:id', component: ClassDetailsComponent, resolve: { classes: ClassResolver }},
      { path: 'class/:id', component: ClassPrincipalComponent, resolve: { classes: ClassResolver }},
      { path: 'class/:id/newCalendar', component: CalendarFormComponent },
      { path: 'class/:idClass/newOrder', component: OrderFormComponent, resolve: { order: OrderResolver}},
      { path: 'class/:idClass/editOrder/:id', component: OrderFormComponent, resolve: { order: OrderResolver}},
      { path: 'class/:idClass/newService', component: ServiceFormComponent, resolve: { service: ServiceResolver}},
      { path: 'class/:idClass/newService/:id_order', component: ServiceFormComponent, resolve: { service: ServiceResolver}},
      { path: 'class/:idClass/editService/:id', component: ServiceFormComponent, resolve: { service: ServiceResolver}}
    ]
  }
];
