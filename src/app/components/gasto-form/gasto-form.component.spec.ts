import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicTesting } from '../../testing/ionic-testing';

import { GastoFormComponent } from './gasto-form.component';

describe('GastoFormComponent', () => {
  let component: GastoFormComponent;
  let fixture: ComponentFixture<GastoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GastoFormComponent],
      providers: [provideIonicTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(GastoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
