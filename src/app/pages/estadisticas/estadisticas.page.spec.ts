import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { EstadisticasPage } from './estadisticas.page';
import { StorageService } from '../../services/storage';
import { UiService } from '../../services/ui';

describe('EstadisticasPage', () => {
  let component: EstadisticasPage;
  let fixture: ComponentFixture<EstadisticasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasPage],
      providers: [provideIonicTesting(), StorageService, UiService, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
