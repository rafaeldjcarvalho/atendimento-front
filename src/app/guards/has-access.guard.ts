import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';
import { Access } from '../types/access.type';

@Injectable({
  providedIn: 'root',
})
export class HasAccessGuard {
  private authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasAccess(route);
  }

  canMatch(route: Route): Observable<boolean> {
    return this.hasAccess(route);
  }

  private hasAccess(route: Route | ActivatedRouteSnapshot): Observable<boolean> {
    const allowedAccess = route.data?.['allowedAccess']; // Acessos permitidos vindos da configuração de rotas

    return this.authService.user$.pipe(
      map((user) => Boolean(user && allowedAccess.includes(user.access))),
      tap((hasAccess) => {
        if (!hasAccess) {
          alert('Acesso negado. Você não tem permissão para acessar esta rota.');
        }
      })
    );
  }
}

export const hasAccess: (allowedAccess: Access[]) => CanActivateFn | CanMatchFn =
  (allowedAccess: Access[]) => {
    const authService = inject(AuthService);
    return () =>
      authService.user$.pipe(
        map((user) => Boolean(user && allowedAccess.includes(user.access))),
        tap((hasAccess) => {
          if (!hasAccess) {
            alert('Acesso negado. Você não tem permissão para acessar esta rota.');
          }
        })
      );
  };
