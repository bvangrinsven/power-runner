import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { SettingsPaneComponent } from './settings-pane.component';

describe('SettingsPaneComponent', () => {
  let component: SettingsPaneComponent;
  let fixture: ComponentFixture<SettingsPaneComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
