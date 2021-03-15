import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      login: new FormControl(''),
      password: new FormControl(''),
    });
  }

  auth(value) {
    console.log(value);
  }
}
