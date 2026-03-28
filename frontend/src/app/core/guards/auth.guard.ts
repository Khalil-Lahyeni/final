import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const http        = inject(HttpClient);
  const authService = inject(AuthService);
  const router      = inject(Router);

  return http
    .get<any>(`${environment.apiGatewayUrl}/api/auth/userinfo`, {
      withCredentials: true
    })
    .pipe(
      map((user) => {
        authService.loadUserInfo();
        return true;
      }),
      catchError(() => {
        window.location.href = `${environment.apiGatewayUrl}/api/auth/login`;
        return of(false);
      })
    );
};