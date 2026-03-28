import { Component, computed, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule }     from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { Output, EventEmitter } from '@angular/core';
export interface NavItem {
  label: string;
  icon:  string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  
  constructor(public authService: AuthService) {}

  isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'bi-speedometer2', route: '/dashboard'  },
  ];

  readonly username = computed(() => this.authService.username());

  logout(): void {
    this.authService.logout();
  }


toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
  this.collapsedChange.emit(this.isCollapsed);
}

}
