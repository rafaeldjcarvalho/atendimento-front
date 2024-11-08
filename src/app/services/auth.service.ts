import { Injectable } from '@angular/core';
import { BehaviorSubject, ignoreElements, map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../types/login-response.type';
import { HttpClient } from '@angular/common/http';
import { User, UserWithToken } from '../interfaces/user.interface';

const USER_SESSION_STORAGE_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = "http://localhost:8080/auth";

  private user = new BehaviorSubject<UserWithToken | null>(null);
  user$ = this.user.asObservable();
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(Boolean));

  constructor(
    private httpClient: HttpClient,
    //private router: Router,
  ) {
    this.loadUserFromSessionStorage();
  }

  ngOnInit() {

  }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password}).pipe(
      tap((userToken) => this.saveTokenToSessionStore(userToken.token)),
      tap((userToken) => this.pushNewUser(userToken.token)),
      //tap(() => this.router.navigate(["home"])),
      //ignoreElements()
    );
  }

  signup(name: string, email: string, password: string, typeAcess: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, email, password, typeAcess }).pipe(
      tap((value) => {
        //this.redirectTo("login");
        //this.authService.setSession(value.typeAcess, value.status);
        //sessionStorage.setItem("auth-token", value.token)
        //sessionStorage.setItem("username", value.name)
      })
    )
  }

  logout(): void {
    this.removeUserFromSessionStorage();
    this.user.next(null);
  }

  //private redirectTo(page: string): void {
  //  this.router.navigate([page]);
  //}

  private pushNewUser(token: string) {
    const decodedUser = this.decodeToken(token);
    console.log('Token decodificado:', decodedUser);
    if (decodedUser) {
      this.user.next(decodedUser);
      console.log('Estado atualizado:', decodedUser);
    } else {
      this.user.next(null);
      console.warn('Token inválido ou expirado.');
    }
  }

  //private pushNewUser(token: string) {
  //  this.user.next(this.decodeToken(token));
  //  //console.log(this.user)
  //}

  private decodeToken(userToken: string): UserWithToken | null {
    try {
      const payloadBase64 = userToken.split('.')[1];
      const payloadDecoded = JSON.parse(window.atob(payloadBase64)) as User;

      return { ...payloadDecoded, token: userToken };
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  private loadUserFromSessionStorage(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userFromSession = sessionStorage.getItem(USER_SESSION_STORAGE_KEY);

      if (userFromSession) {
        this.pushNewUser(userFromSession);
      }
    } else {
      console.warn('sessionStorage não está carregando disponível neste ambiente.');
    }
  }

  private saveTokenToSessionStore(userToken: string): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(USER_SESSION_STORAGE_KEY, userToken);
    } else {
      console.warn('sessionStorage não está salvando disponível neste ambiente.');
    }
  }

  private removeUserFromSessionStorage(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
    } else {
      console.warn('sessionStorage não está removendo disponível neste ambiente.');
    }
  }

}
