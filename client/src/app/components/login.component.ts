import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tokenSvc: TokenService) { }

  ngOnInit() {
  }

  login(form: NgForm){
    console.log("form.value=", form.value);
    this.tokenSvc.authenticate(form.value['username'], form.value['password'])
    .then (result=>{
      console.log("my token=", result);
    })
    this.router.navigate(['/list']);
  }

}
