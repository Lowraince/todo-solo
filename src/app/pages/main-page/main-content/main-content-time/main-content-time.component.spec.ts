import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentTimeComponent } from './main-content-time.component';

describe('MainContentTimeComponent', () => {
  let component: MainContentTimeComponent;
  let fixture: ComponentFixture<MainContentTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContentTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
