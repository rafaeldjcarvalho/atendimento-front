import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserWithToken } from '../../interfaces/user.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule ],
  providers: [
    AuthService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  user$: Observable<UserWithToken | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
    //this.user$.subscribe((user) => console.log('Usuário recebido no Home:', user));
  }

  ngOnInit(): void {}

  loggout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
