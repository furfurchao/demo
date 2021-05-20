import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugWindowComponent } from './drug-window.component';

describe('DrugWindowComponent', () => {
  let component: DrugWindowComponent;
  let fixture: ComponentFixture<DrugWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
