import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersSimpleComponent } from './filters-simple.component';

describe('FiltersSimpleComponent', () => {
  let component: FiltersSimpleComponent;
  let fixture: ComponentFixture<FiltersSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
