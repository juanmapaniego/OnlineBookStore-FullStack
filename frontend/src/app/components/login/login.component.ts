import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/common/user';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  model: User = new User();
  loginForm = new FormGroup({
    username:new FormControl(),
    password: new FormControl()
  });

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
      sessionStorage.setItem('token', '');
  }

  login(){
    console.log(this.loginForm);
    //this.loginForm.reset();
  }

  login2() {
      let url = 'http://localhost:8082/login';
      let result = this.http.post<Observable<boolean>>(url, {
        userName: this.model.username,
        password: this.model.password
    }).subscribe(isValid => {
        if (isValid) {
            sessionStorage.setItem(
              'token', 
              btoa(this.model.username + ':' + this.model.password)
            );
        this.router.navigate(['']);
        } else {
            alert("Authentication failed.")
        }
    });
  }
}