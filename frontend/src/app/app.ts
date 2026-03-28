import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  template: `
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">Fleet Management</p>
        <h1>Gateway + Keycloak Frontend</h1>
        <p class="subtitle">
          Interface Angular 20 pour lancer l'authentification et verifier l'acces a l'API protegee.
        </p>

        <div class="actions">
          <button type="button" class="btn btn-primary" (click)="signIn()">Sign in</button>
          <button type="button" class="btn" (click)="signOut()">Sign out</button>
          <button type="button" class="btn" (click)="checkProtectedApi()" [disabled]="loading()">
            {{ loading() ? 'Checking...' : 'Test protected API' }}
          </button>
        </div>

        <div class="meta">
          <p><strong>Gateway:</strong> {{ gatewayBase }}</p>
          <p><strong>API test URL:</strong> {{ apiUrl }}</p>
        </div>
      </section>

      <section class="panel">
        <h2>Resultat API</h2>
        @if (error()) {
          <pre class="output error">{{ error() }}</pre>
        } @else {
          <pre class="output">{{ output() }}</pre>
        }
      </section>
    </main>
  `,
  styleUrl: './app.scss'
})
export class App {
  private readonly http = inject(HttpClient);

  readonly gatewayBase = 'http://localhost:8888';
  readonly apiUrl = `${this.gatewayBase}/api/Micro-service/test`;

  readonly loading = signal(false);
  readonly output = signal('Clique sur "Test protected API" pour verifier la session OAuth2.');
  readonly error = signal('');

  signIn(): void {
    window.location.href = `${this.gatewayBase}/oauth2/authorization/keycloak`;
  }

  signOut(): void {
    window.location.href = `${this.gatewayBase}/logout`;
  }

  checkProtectedApi(): void {
    this.loading.set(true);
    this.error.set('');

    this.http
      .get(this.apiUrl, { responseType: 'text', withCredentials: true })
      .subscribe({
        next: (response) => {
          this.output.set(response || 'Request OK (empty body).');
          this.loading.set(false);
        },
        error: (err: unknown) => {
          const serialized = this.stringifyError(err);
          this.error.set(serialized);
          this.loading.set(false);
        }
      });
  }

  private stringifyError(err: unknown): string {
    if (typeof err === 'string') {
      return err;
    }
    return JSON.stringify(err, null, 2);
  }
}
