import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.checkAndUpdateLoginState().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true; // Permite o acesso
        } else {
          this.router.navigate(['login']); // Redireciona para login se não estiver logado
          return false;
        }
      })
    );
  }
}
