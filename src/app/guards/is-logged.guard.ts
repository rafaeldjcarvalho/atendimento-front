import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(){
    const authToken = sessionStorage.getItem("userData");

    if (authToken) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
