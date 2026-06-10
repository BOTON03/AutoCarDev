import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VehiculoFormComponent } from './recordatorio-form.component';

describe('VehiculoFormComponent', () => {
  let component: VehiculoFormComponent;
  let fixture: ComponentFixture<VehiculoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VehiculoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
