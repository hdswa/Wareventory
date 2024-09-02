import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Assume you have an AuthService to handle authentication

@Injectable({
    providedIn: 'root'
  })
  export class AdminAuthGuard implements CanActivate{
    
      constructor(private authService: AuthService, private router: Router) {}
    
      canActivate(): boolean {
        console.log("valor de session storage",sessionStorage.getItem('role'));
        if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
          return true;
        } else {
          this.router.navigate(['/auth/login']); // Redirect to login if not authenticated
          return false;
        }
      }
  }