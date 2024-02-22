import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CccpasswdchangeComponent } from './cccpasswdchange.component';

describe('CccpasswdchangeComponent', () => {
  let component: CccpasswdchangeComponent;
  let fixture: ComponentFixture<CccpasswdchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CccpasswdchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CccpasswdchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
