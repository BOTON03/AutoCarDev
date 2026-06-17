import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { LoginPage } from './login.page';
import { AuthService } from '../../services/auth';
import { UiService } from '../../services/ui';
import { StorageService } from '../../services/storage';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideIonicTesting(),
        AuthService,
        StorageService,
        UiService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
