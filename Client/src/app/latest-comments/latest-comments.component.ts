import { Component, OnInit } from '@angular/core';
import { LatestComments } from '../models/model.latest.comment';
import { HttpClient } from '@angular/common/http';
import { AnimeServiceService } from '../services/anime-service.service';

@Component({
  selector: 'app-latest-comments',
  templateUrl: './latest-comments.component.html',
  styleUrls: ['./latest-comments.component.css']
})
export class LatestCommentsComponent implements OnInit {

  public latestComment : LatestComments[] = [];

  
  constructor(private http : HttpClient,
              private animeService : AnimeServiceService) {

    animeService.getLatestComments(10).subscribe((res) => {
      res.forEach((comment) => {
        this.latestComment.push(comment);
      });
    });


  }


  ngOnInit(): void {
  }

}
