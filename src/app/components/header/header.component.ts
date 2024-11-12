import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserWithToken } from '../../interfaces/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  emailUser: string | undefined = '';
  private user$: Observable<UserWithToken | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
    this.user$.subscribe((user) => this.emailUser = user?.email )
  }

  loggout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
