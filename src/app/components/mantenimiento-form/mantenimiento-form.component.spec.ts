import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MantenimientoFormComponent } from './mantenimiento-form.component';

describe('MantenimientoFormComponent', () => {
  let component: MantenimientoFormComponent;
  let fixture: ComponentFixture<MantenimientoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MantenimientoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
