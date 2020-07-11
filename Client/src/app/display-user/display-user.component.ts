import { Component, OnInit, HostListener } from '@angular/core';
import { AnimeServiceService } from '../services/anime-service.service';
import { LogInService } from '../services/log-in.service';
import { Anime } from '../models/model.anime';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {
  CAROUSEL_BREAKPOINT = 768;
  carouselDisplayMode = 'multiple';

  url : String;
  public watchedanime: Anime[] = [];
  public wishanime: Anime[] = [];
  public ratedanime: Anime[] = [];

  public showWatched: boolean = false;
  public showWish: boolean = false;
  public showRated: boolean = false;

  public showRange: boolean = false;

  watchedSlides: any = [[]];
  wishSlides: any = [[]];
  ratedSlides: any = [[]];

  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  constructor(public animeService: AnimeServiceService,
              public logInService: LogInService) {

  };

  ngOnInit(): void {
    if (window.innerWidth <= this.CAROUSEL_BREAKPOINT) {
      this.carouselDisplayMode = 'single';
    } else {
      this.carouselDisplayMode = 'multiple';
    }

    this.animeService.AnimeWishlist(this.logInService.getLoggedInUserUsername()).subscribe((res) => {            
      res.forEach( anime => {
        this.wishanime.push(anime);
      }) 
      this.wishSlides = this.chunk(this.wishanime, 4);
      console.log("Wished: ", this.wishanime);
    });

    this.animeService.AnimeWatchedlist(this.logInService.getLoggedInUserUsername()).subscribe((res) => {            
      res.forEach( anime => {
        this.watchedanime.push(anime);
      })
      this.watchedSlides = this.chunk(this.watchedanime, 4);
      console.log("Watched: ", this.watchedanime); 
    });

    this.animeService.AnimeRatedList(this.logInService.getLoggedInUserUsername()).subscribe((res) => {            
      res.forEach( anime => {
        this.ratedanime.push(anime);
      }) 
      this.ratedSlides = this.chunk(this.ratedanime, 4);
      console.log("Rated: ", this.ratedanime);
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (window.innerWidth <= this.CAROUSEL_BREAKPOINT) {
      this.carouselDisplayMode = 'single';
    } else {
      this.carouselDisplayMode = 'multiple';
    }
  }

  public onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = String(event.target.result);
      }
    }
  }

  public deleteWishAnime(animeName: string){
      this.animeService.deleteFromWish(this.logInService.getLoggedInUserUsername(), animeName).subscribe((res) => {
        console.log(res);
        
        this.wishanime = [];
        this.animeService.AnimeWishlist(this.logInService.getLoggedInUserUsername()).subscribe((res) => {            
          res.forEach( anime => {
            this.wishanime.push(anime);
          }) 
          this.wishSlides = [[]];
          this.wishSlides = this.chunk(this.wishanime, 4);
          console.log("Wished: ", this.wishanime);
        });
      });
  }

  public deleteWatchedAnime(animeName: string){
    this.animeService.deleteFromWatched(this.logInService.getLoggedInUserUsername(), animeName).subscribe((res) => {
      console.log(res);
      
      this.watchedanime = [];
      this.animeService.AnimeWatchedlist(this.logInService.getLoggedInUserUsername()).subscribe((res) => {            
        res.forEach( anime => {
          this.watchedanime.push(anime);
        }) 
        this.watchedSlides = [[]];
        this.watchedSlides = this.chunk(this.watchedanime, 4);
        console.log("Watched: ", this.watchedanime);
      });
    });    
  }

  public deleteRating(animeName: string){
    this.animeService.deleteRating(this.logInService.getLoggedInUserUsername(), animeName).subscribe((res) => {
      console.log(res);
      
      this.ratedanime = [];

      this.animeService.AnimeRatedList(this.logInService.getLoggedInUserUsername()).subscribe((res) => {            
        res.forEach( anime => {
          this.ratedanime.push(anime);
        }) 
        this.ratedSlides = [[]];
        this.ratedSlides = this.chunk(this.ratedanime, 4);
        console.log("Rated: ", this.ratedanime);
      });
    });  
  }

  public updateRating(animeName: string){
    console.log("anime name: ", animeName);
  }
  
  public changeShowRange(){
    this.showRange = !this.showRange;
    console.log("Eh");
  }

  public changeShowRangeAndUpdate(){
    this.showRange = !this.showRange;
    console.log("pozovi update zahtev sa vrednoscu!");
  }
}
