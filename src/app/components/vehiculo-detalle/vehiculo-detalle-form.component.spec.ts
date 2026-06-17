import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { VehiculoDetallePage } from './vehiculo-detalle-form.component';
import { StorageService } from '../../services/storage';
import { UiService } from '../../services/ui';

describe('VehiculoDetallePage', () => {
  let component: VehiculoDetallePage;
  let fixture: ComponentFixture<VehiculoDetallePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VehiculoDetallePage],
      providers: [
        provideIonicTesting(),
        StorageService,
        UiService,
        provideRouter([{ path: 'vehiculos/:id', component: VehiculoDetallePage }])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
