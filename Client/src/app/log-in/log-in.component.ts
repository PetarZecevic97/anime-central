import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  public LogInForm: FormGroup;
  public LogInSuccessful: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.LogInForm = formBuilder.group({      
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
   }

  ngOnInit(): void {
  }

  public submitLogInForm(formValue: any){
    this.LogInSuccessful = true;

    //TODO: send request to server!
    return
  }

  public get username(){
    return this.LogInForm.get('username');
  }
  public get password(){
    return this.LogInForm.get('password');
  }

}
