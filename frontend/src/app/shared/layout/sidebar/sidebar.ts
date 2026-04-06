import { Component, computed, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { DialogService } from '../../service/dialog.service';
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
  
  constructor(
    public authService: AuthService,
    private dialogService: DialogService
  ) {}

  isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'bi-speedometer2', route: '/dashboard'  },
    { label: 'Trains',     icon: 'bi-train-freight', route: '/trains'     },
  ];

  readonly username = computed(() => this.authService.username());

  async logout(): Promise<void> {
    const confirmed = await this.dialogService.openConfirmLogout();
    if (confirmed) {
      this.authService.logout();
    }
  }


toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
  this.collapsedChange.emit(this.isCollapsed);
}

}
