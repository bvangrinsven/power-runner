import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ScriptFormComponent } from './script-form.component';

describe('ScriptFormComponent', () => {
  let component: ScriptFormComponent;
  let fixture: ComponentFixture<ScriptFormComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
