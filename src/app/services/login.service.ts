import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl: string = "http://localhost:8080/auth";

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password }).pipe(
      tap((value) => {
        //this.authService.setSession(value.typeAcess, value.status);
        //sessionStorage.setItem("auth-token", value.token);
        //sessionStorage.setItem("username", value.name);
      })
    )
  }

  signup(name: string, email: string, password: string, typeAcess: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, email, password, typeAcess }).pipe(
      tap((value) => {
        //this.authService.setSession(value.typeAcess, value.status);
        //sessionStorage.setItem("auth-token", value.token)
        //sessionStorage.setItem("username", value.name)
      })
    )
  }
}
