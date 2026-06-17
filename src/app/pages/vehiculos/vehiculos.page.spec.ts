import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { VehiculosPage } from './vehiculos.page';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { UiService } from '../../services/ui';

describe('VehiculosPage', () => {
  let component: VehiculosPage;
  let fixture: ComponentFixture<VehiculosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosPage],
      providers: [
        provideIonicTesting(),
        AuthService,
        StorageService,
        UiService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
