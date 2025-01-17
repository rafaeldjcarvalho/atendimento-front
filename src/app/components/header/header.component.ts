import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserWithToken } from '../../interfaces/user.interface';
import { SidenavService } from '../../services/sidenav.service';

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
  statusUser: string | undefined = '';
  idUser: string | undefined = '';
  private user$: Observable<UserWithToken | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService
  ){
    this.user$ = this.authService.user$;
    this.user$.subscribe((user) => {
      this.emailUser = user?.email;
      this.idUser = user?.id;
      this.statusUser = user?.status;
    })
  }

  loggout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  editUser(id: string) {
    if(id != '') {
      this.router.navigate(['/user/edit', id]);
    }
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }
}
