import {EnvironmentService} from '@apps/shared/services';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    service = new EnvironmentService();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
