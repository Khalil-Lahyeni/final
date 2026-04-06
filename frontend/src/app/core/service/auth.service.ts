import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

export interface UserInfo {
  sub:                string;
  preferred_username: string;
  email:              string;
  given_name?:        string;
  family_name?:       string;
  roles?:             string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user    = signal<UserInfo | null>(null);
  private _loading = signal<boolean>(false);

  readonly user        = computed(() => this._user());
  readonly isLoggedIn  = computed(() => this._user() !== null);
  readonly loading     = computed(() => this._loading());
  readonly username    = computed(() => this._user()?.preferred_username ?? '');

  constructor(
    private http:   HttpClient,
    private router: Router
  ) {}

  loadUserInfo(): void {
    this._loading.set(true);
    this.http
      .get<UserInfo>(`${environment.apiGatewayUrl}/api/auth/userinfo`, {
        withCredentials: true  
      })
      .subscribe({
        next: (user) => {
          this._user.set(user);
          this._loading.set(false);
        },
        error: () => {
          this._user.set(null);
          this._loading.set(false);
        }
      });
  }


  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<UserInfo>(`${environment.apiGatewayUrl}/api/auth/userinfo`, {
        withCredentials: true
      })
      .pipe(
        map((user) => {
          this._user.set(user); 
          return true;
        }),
        catchError(() => {
          this._user.set(null);
          return of(false);
        })
      );
  }

  login(): void {
    window.location.href = `${environment.apiGatewayUrl}/api/auth/login`;
  }

  logout(): void {
    this._user.set(null);
    localStorage.setItem('fleet-logout', Date.now().toString());

    // Trigger server logout with POST to avoid the default GET confirmation page.
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${environment.apiGatewayUrl}/logout`;
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  hasRole(role: string): boolean {
    return this._user()?.roles?.includes(role) ?? false;
  }
}