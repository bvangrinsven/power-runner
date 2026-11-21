import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { AddProfileDialogComponent } from './add-profile-dialog.component';

describe('AddProfileDialogComponent', () => {
  let component: AddProfileDialogComponent;
  let fixture: ComponentFixture<AddProfileDialogComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
