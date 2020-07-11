import { Component, OnInit } from '@angular/core';
import { LogInService } from '../services/log-in.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  

  constructor(public logInService : LogInService) { 
    
  }

  ngOnInit(): void {
  }

  
  
  public userLogOut(){
    this.logInService.logOut();
  }



}
