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
    return this.authService.isLoggedIn$.pipe(
      take(1), // Obtém apenas o primeiro valor emitido
      map((isLoggedIn) => {
        //console.log("Logado? " + isLoggedIn);
        if (isLoggedIn) {
          return true; // Permite acesso
        } else {
          this.router.navigate(['login']); // Redireciona para login se não logado
          return false;
        }
      })
    );
  }
}
