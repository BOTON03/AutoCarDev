import { TestBed } from '@angular/core/testing';

import { RecordatorioService } from './recordatorio';
import { StorageService } from './storage';

describe('RecordatorioService', () => {
  let service: RecordatorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecordatorioService, StorageService]
    });
    service = TestBed.inject(RecordatorioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
