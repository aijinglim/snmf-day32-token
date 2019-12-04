import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';
import { OtpService } from '../services/otp.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tokenSvc: TokenService, private otpSvc: OtpService) { }


  ngOnInit() {
    console.log("is authenticated=", this.tokenSvc.isAuthenticatedLogin());
    this.otpSvc.getCustomers()
    .then(result=>{
      console.log("getCustomers result", result);
    })
  }

  reload(){
    this.otpSvc.getCustomers()
    .then(result=>{
      console.log("getCustomers result", result);
    })
    .catch(err=>{
      console.log("Error=", err);
    })
  }


}
