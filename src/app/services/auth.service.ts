import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { LoginResponse } from '../types/login-response.type';
import { HttpClient } from '@angular/common/http';
import { UserWithToken } from '../interfaces/user.interface';
import { Router } from '@angular/router';

const USER_SESSION_STORAGE_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = "http://localhost:8080/auth";

  private user = new BehaviorSubject<UserWithToken | null>(null);
  user$ = this.user.asObservable();
  isLoggedIn$ = this.user$.pipe(map((user) => !!user));

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.loadUserFromSessionStorage();
  }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password}).pipe(
      tap((userToken) => {
        this.saveTokenToSessionStore(userToken.token);
        this.pushNewUser(userToken.token);
      }),
      switchMap(() => this.isLoggedIn$.pipe(take(1))), // Aguarda o estado de login
      tap(() => this.redirectTo("home")),
      //ignoreElements()
    );
  }

  signup(name: string, email: string, password: string, typeAcess: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, email, password, typeAcess }).pipe(
      tap(() => {
        this.redirectTo("login");
      })
    )
  }

  logout(): void {
    this.removeUserFromSessionStorage();
    this.user.next(null);
  }

  private redirectTo(page: string): void {
    this.router.navigate([page]);
  }

  private pushNewUser(token: string) {
    //console.log('Decoded User:', token);
    this.user.next(this.decodeToken(token));
  }

  private decodeToken(userToken: string): UserWithToken {
    try {
      const base64Payload = userToken.split('.')[1];
      const decodedPayload = JSON.parse(window.atob(base64Payload)) as any;

      const userWithToken: UserWithToken = {
        email: decodedPayload.sub, // Mapeia 'sub' para 'email'
        access: decodedPayload.access, // Mapeia 'Access' (ajuste a capitalização se necessário)
        status: decodedPayload.status, // Usa 'status' diretamente
        token: userToken, // Inclui o token no objeto
      };

      return userWithToken;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      throw new Error('Token inválido');
    }
  }

  private loadUserFromSessionStorage(): void {
    const userFromSession = sessionStorage.getItem(USER_SESSION_STORAGE_KEY);
    //console.log('User from Local Storage:', userFromSession);
    if(userFromSession) {
      this.pushNewUser(userFromSession);
    }
  }

  private saveTokenToSessionStore(userToken: string): void {
    sessionStorage.setItem(USER_SESSION_STORAGE_KEY, userToken);
  }

  private removeUserFromSessionStorage(): void {
    sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
    this.user.next(null);
  }

}
