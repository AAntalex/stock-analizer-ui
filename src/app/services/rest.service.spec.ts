import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';
import {environment} from '@environments/environment';

describe('RestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestService = TestBed.get(RestService);
    expect(service).toBeTruthy();
  });
});
