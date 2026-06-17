import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { VehiculoFormComponent } from './vehiculo-form.component';

describe('VehiculoFormComponent', () => {
  let component: VehiculoFormComponent;
  let fixture: ComponentFixture<VehiculoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VehiculoFormComponent],
      providers: [provideIonicTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
