import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { RecordatoriosPage } from './recordatorios.page';
import { StorageService } from '../../services/storage';
import { RecordatorioService } from '../../services/recordatorio';
import { NotificationService } from '../../services/notification';
import { UiService } from '../../services/ui';

describe('RecordatoriosPage', () => {
  let component: RecordatoriosPage;
  let fixture: ComponentFixture<RecordatoriosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordatoriosPage],
      providers: [
        provideIonicTesting(),
        StorageService,
        RecordatorioService,
        NotificationService,
        UiService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordatoriosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
