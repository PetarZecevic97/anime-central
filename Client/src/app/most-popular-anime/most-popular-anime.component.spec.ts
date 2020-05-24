import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostPopularAnimeComponent } from './most-popular-anime.component';

describe('MostPopularAnimeComponent', () => {
  let component: MostPopularAnimeComponent;
  let fixture: ComponentFixture<MostPopularAnimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostPopularAnimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostPopularAnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
