import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { switchMap, first } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injeção do serviço diretamente

  return authService.isLoggedIn$.pipe(
    first(),
    switchMap((isLoggedIn) => {
      if (!isLoggedIn) {
        // Se o usuário não está logado, processa a requisição normalmente
        return next(req);
      }

      return authService.user$.pipe(
        first(Boolean),
        switchMap(({ token }) => {
          // Clona a requisição e adiciona o cabeçalho Authorization com o token
          const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next(clonedRequest);
        })
      );
    })
  );
};


