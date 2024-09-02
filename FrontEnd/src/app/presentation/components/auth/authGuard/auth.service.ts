import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  isAuthenticated(): boolean {
    // Check if the token exists in localStorage or any other storage
    return !!sessionStorage.getItem('token');
  }

  isAdmin(): boolean {
    console.log("asdasdasdasdsad")
    // Check if the token exists in localStorage or any other storage
    return sessionStorage.getItem('role') === 'admin';
  }
}