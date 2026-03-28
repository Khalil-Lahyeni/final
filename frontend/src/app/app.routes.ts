import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
      // ── Page callback après login Keycloak ──
  {
    path: 'callback',
    loadComponent: () =>
      import('./features/auth/callback/callback')
        .then(m => m.Callback)
  },
    // ── Routes protégées par authGuard ──
  {
    path: 'dashboard', canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
    // ── Redirect par défaut ──
  {
    path: '', canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },

  {
    path: 'profile', canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile)
  }

];