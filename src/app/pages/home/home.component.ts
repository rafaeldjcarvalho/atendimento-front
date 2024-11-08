import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  loggout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
