import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ClassService } from '../services/class/class.service';
import { first, map, Observable, of } from 'rxjs';
import { Class } from '../interfaces/class.interface';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassResolver  {

  constructor(private service: ClassService, private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Class> {
    if (route.params && route.params['id']) {
      return this.service.loadById(route.params['id']);
    }

    return this.authService.user$.pipe(
      first(), // Obtém o valor atual do usuário logado
      map((user) => ({
        id: '',
        name: '',
        date: new Date().toISOString().split('T')[0],
        owner: {
          id: user?.id || '', // Preencha com ID do usuário, se aplicável
          name: user?.name || '', // Preencha com nome do usuário, se aplicável
          email: user?.email || '', // Cria um Observable para o email
          status: user?.status || 'Ativo',
          access: user?.access || 'Professor',
        },
      }))
    );
  }
}
