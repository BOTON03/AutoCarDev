import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should persist and retrieve values', async () => {
    await service.set('test-key', { nombre: 'AutoCare' });
    const value = await service.get('test-key');
    expect(value).toEqual({ nombre: 'AutoCare' });
    await service.remove('test-key');
  });
});
