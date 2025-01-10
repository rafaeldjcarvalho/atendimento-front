import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { switchMap, first, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injeção do AuthService diretamente
  const toastr = inject(ToastrService); // Injeção do ngx-toastr
  const router = inject(Router); // Injeção do roteador para redirecionar

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

          return next(clonedRequest).pipe(
            // Possivel erro ao carregar página
            catchError((error) => {
              if (error.status === 403) {
                // Exibe uma mensagem de erro e redireciona o usuário para login
                toastr.error('Sua sessão expirou. Faça login novamente.', 'Sessão Expirada');
                router.navigate(['/login']);
              }
              return throwError(() => error); // Propaga o erro
            })
          );
        })
      );
    })
  );
};


