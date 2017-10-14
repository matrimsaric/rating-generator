import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameReportComponent } from './game-report.component';

describe('GameReportComponent', () => {
  let component: GameReportComponent;
  let fixture: ComponentFixture<GameReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
