import { Component, OnInit, HostListener} from '@angular/core';
import { AnimeServiceService } from '../services/anime-service.service';
import { Anime } from '../models/model.anime';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css']
})



export class MainBodyComponent implements OnInit {

  CAROUSEL_BREAKPOINT = 768;
  carouselDisplayMode = 'multiple';

  public AnimeList: Observable<Anime[]>;
  public animeList: Anime[] = [];
  public array : number[] = [1, 2, 3, 4];

  slides: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }
  
  constructor(private animeService: AnimeServiceService) { 
    this.AnimeList = animeService.getAnimeList();
    animeService.getAnimeList().subscribe( animes => { 
      this.animeList = animes;
      this.slides = this.chunk(this.animeList, 4);
    }
  );
    

  }

  

  ngOnInit() {
    if (window.innerWidth <= this.CAROUSEL_BREAKPOINT) {
      this.carouselDisplayMode = 'single';
    } else {
      this.carouselDisplayMode = 'multiple';
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (window.innerWidth <= this.CAROUSEL_BREAKPOINT) {
      this.carouselDisplayMode = 'single';
    } else {
      this.carouselDisplayMode = 'multiple';
    }
  }

}
