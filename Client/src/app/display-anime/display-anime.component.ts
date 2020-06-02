import { Component, OnInit, Input } from '@angular/core';
import { Anime } from '../models/model.anime';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-display-anime',
  templateUrl: './display-anime.component.html',
  styleUrls: ['./display-anime.component.css']
})
export class DisplayAnimeComponent implements OnInit {

  @Input()
  public anime: Anime;


  constructor(private sanitizer:DomSanitizer) {
    
    
  }


  ngOnInit(): void {
    this.anime.picture = 'http://localhost:3000/anime/picture/bleach'; 
       
}
    

}

