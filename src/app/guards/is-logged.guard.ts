import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard {

  constructor(
    private router: Router
  ) {}


  canActivate(){
    const authToken = sessionStorage.getItem("userData");

    if (authToken) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
