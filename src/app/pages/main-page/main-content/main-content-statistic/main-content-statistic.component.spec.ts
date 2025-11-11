import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentStatisticComponent } from './main-content-statistic.component';

describe('MainContentStatisticComponent', () => {
  let component: MainContentStatisticComponent;
  let fixture: ComponentFixture<MainContentStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContentStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
