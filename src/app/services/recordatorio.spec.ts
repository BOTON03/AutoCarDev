import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect } from '@jest/globals';

import { Recordatorio } from './recordatorio';

describe('Recordatorio', () => {
  let service: Recordatorio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recordatorio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
