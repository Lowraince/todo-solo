import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotViewIconComponent } from './not-view-icon.component';

describe('NotViewIconComponent', () => {
  let component: NotViewIconComponent;
  let fixture: ComponentFixture<NotViewIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotViewIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotViewIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
