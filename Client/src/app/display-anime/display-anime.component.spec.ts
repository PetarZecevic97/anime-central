import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAnimeComponent } from './display-anime.component';

describe('DisplayAnimeComponent', () => {
  let component: DisplayAnimeComponent;
  let fixture: ComponentFixture<DisplayAnimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayAnimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
