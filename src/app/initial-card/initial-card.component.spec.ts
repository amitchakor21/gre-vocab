import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialCardComponent } from './initial-card.component';

describe('InitialCardComponent', () => {
  let component: InitialCardComponent;
  let fixture: ComponentFixture<InitialCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
