import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogInService } from '../services/log-in.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  public LogInForm: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private logInService: LogInService) {
    this.LogInForm = formBuilder.group({      
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
}

  ngOnInit(): void {
  }

  public submitLogInForm(formValue: any){
    
    

    this.logInService.logIn(this.LogInForm.get("username").value, this.LogInForm.get("password").value);

  }

  public get username(){
    return this.LogInForm.get('username');
  }
  public get password(){
    return this.LogInForm.get('password');
  }

  public isErrors(){
    return this.logInService.isErrors();
  }

  public errorMessage(){
    return this.logInService.errorMessage();
  }

}
