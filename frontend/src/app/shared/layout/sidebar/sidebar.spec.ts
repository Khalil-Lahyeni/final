import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { AuthService } from '../../../core/service/auth.service';
import { of } from 'rxjs';

class MockAuthService {
  username = () => 'TestUser';
  logout = jasmine.createSpy('logout');
}

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let authService: MockAuthService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
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

  it('should call logout service method', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should return username from AuthService', () => {
    expect(component.username()).toBe('TestUser');
  });
});