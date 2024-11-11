import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserWithToken } from '../../interfaces/user.interface';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  providers: [
    AuthService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  user$: Observable<UserWithToken | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
    //this.user$.subscribe((user) => console.log('Usuário recebido no Home:', user));
  }

  ngOnInit(): void {}
}
