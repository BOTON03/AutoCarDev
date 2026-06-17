import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { MantenimientosPage } from './mantenimientos.page';
import { StorageService } from '../../services/storage';
import { RecordatorioService } from '../../services/recordatorio';
import { UiService } from '../../services/ui';

describe('MantenimientosPage', () => {
  let component: MantenimientosPage;
  let fixture: ComponentFixture<MantenimientosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientosPage],
      providers: [
        provideIonicTesting(),
        StorageService,
        RecordatorioService,
        UiService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
