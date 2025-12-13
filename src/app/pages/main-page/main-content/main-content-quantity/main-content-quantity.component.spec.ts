import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentQuantityComponent } from './main-content-quantity.component';

describe('MainContentQuantityComponent', () => {
  let component: MainContentQuantityComponent;
  let fixture: ComponentFixture<MainContentQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContentQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
