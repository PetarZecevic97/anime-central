import { Component, OnInit } from '@angular/core';
import { AnimeServiceService } from '../services/anime-service.service';
import { LogInService } from '../services/log-in.service';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {

  url : String;

  constructor(public animeService: AnimeServiceService,
              public logInService: LogInService) { }

  ngOnInit(): void {
  }

  onClick() {
    const username = this.logInService.getLoggedInUserUsername();
    console.log(this.animeService.AnimeWatchedlist(username).subscribe((res) =>{
      if(res){
          console.log(res);    
      }else{
        console.log(res);
      }
    }));
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = String(event.target.result);
      }
    }
  }
}
