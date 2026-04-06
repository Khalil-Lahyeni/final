import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { AuthService } from '../../../core/service/auth.service';
import { DialogService } from '../../service/dialog.service';

class MockAuthService {
  username = () => 'TestUser';
  logout = jasmine.createSpy('logout');
}

class MockDialogService {
  openConfirmLogout = jasmine.createSpy('openConfirmLogout').and.resolveTo(true);
}

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let authService: MockAuthService;
  let dialogService: MockDialogService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: DialogService, useClass: MockDialogService }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
    dialogService = TestBed.inject(DialogService) as any;
    fixture.detectChanges();
  });

  it('should create sidebar component', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle sidebar collapsed state', () => {
    expect(component.isCollapsed).toBeFalse();
    component.toggleSidebar();
    expect(component.isCollapsed).toBeTrue();
  });

  it('should call logout service method after confirmation', async () => {
    await component.logout();
    expect(dialogService.openConfirmLogout).toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should return username from AuthService', () => {
    expect(component.username()).toBe('TestUser');
  });
});