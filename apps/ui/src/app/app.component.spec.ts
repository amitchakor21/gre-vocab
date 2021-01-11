import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {EnvironmentService} from '@apps/shared/services';
import {createMock} from '@testing-library/angular/jest-utils';
import {SharedComponentsButtonModule} from '@apps/shared/components/button';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[SharedComponentsButtonModule],
      providers:[
        {provide: EnvironmentService, useValue: createMock(EnvironmentService)},
      ],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ui'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ui');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to ui!'
    );
  });
});
