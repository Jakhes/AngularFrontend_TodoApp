import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoldComponent } from './mold.component';

describe('MoldComponent', () => {
  let component: MoldComponent;
  let fixture: ComponentFixture<MoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
