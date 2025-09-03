import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilPageComponent } from './profil-page.component';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ProfilPageComponent', () => {
  let component: ProfilPageComponent;
  let fixture: ComponentFixture<ProfilPageComponent>;
  let mockAppService: jasmine.SpyObj<AppService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAppService = jasmine.createSpyObj('AppService', ['getCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockAppService.getCurrentUser.and.returnValue(
      of({
        user: {
          username: 'TestUser',
          email: 'test@example.com',
          address: '123 Test St',
        },
      })
    );

    await TestBed.configureTestingModule({
      imports: [ProfilPageComponent],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.user).toEqual({
      username: 'TestUser',
      email: 'test@example.com',
      address: '123 Test St',
    });
    expect(mockAppService.getCurrentUser).toHaveBeenCalled();
  });
});
