import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/layout/sidebar/sidebar';
import { environment } from '../environments/environment';
import { ConfirmDialog } from './shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Sidebar, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
isSidebarCollapsed = false;

constructor() {
  window.addEventListener('storage', (event) => {
    if (event.key === 'fleet-logout') {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${environment.apiGatewayUrl}/logout`;
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
    }
  });
}
 
onSidebarToggle(collapsed: boolean) {
  this.isSidebarCollapsed = collapsed;
}

}