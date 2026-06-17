import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { RecordatorioFormComponent } from './recordatorio-form.component';

describe('RecordatorioFormComponent', () => {
  let component: RecordatorioFormComponent;
  let fixture: ComponentFixture<RecordatorioFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecordatorioFormComponent],
      providers: [provideIonicTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordatorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
