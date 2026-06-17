import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { GastosPage } from './gastos.page';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { UiService } from '../../services/ui';

describe('GastosPage', () => {
  let component: GastosPage;
  let fixture: ComponentFixture<GastosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosPage],
      providers: [
        provideIonicTesting(),
        AuthService,
        StorageService,
        UiService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GastosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
