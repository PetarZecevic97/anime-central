import { Component, OnInit, Input } from '@angular/core';
import { Anime } from '../models/model.anime';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-anime',
  templateUrl: './display-anime.component.html',
  styleUrls: ['./display-anime.component.css']
})
export class DisplayAnimeComponent implements OnInit {

  @Input()
  public anime: Anime;


  constructor(private route: ActivatedRoute) {
    
    this.route.paramMap.subscribe(params => {
      const pId: number = Number(params.get('id'));
      console.log(pId);      
  });
}

  ngOnInit(): void {
}
    

}

