import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStandingsComponent } from './current-standings.component';

describe('CurrentStandingsComponent', () => {
  let component: CurrentStandingsComponent;
  let fixture: ComponentFixture<CurrentStandingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentStandingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
