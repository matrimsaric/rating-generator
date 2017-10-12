import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionEntryComponent } from './competition-entry.component';

describe('CompetitionEntryComponent', () => {
  let component: CompetitionEntryComponent;
  let fixture: ComponentFixture<CompetitionEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
