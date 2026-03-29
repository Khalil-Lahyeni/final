import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const http        = inject(HttpClient);
  const authService = inject(AuthService);

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
        const params = new URLSearchParams(window.location.search);
        const shouldForceLoginPrompt = params.get('forceLogin') === 'true';
        const loginUrl = shouldForceLoginPrompt
          ? `${environment.apiGatewayUrl}/oauth2/authorization/keycloak?prompt=login`
          : `${environment.apiGatewayUrl}/api/auth/login`;

        window.location.href = loginUrl;
        return of(false);
      })
    );
};