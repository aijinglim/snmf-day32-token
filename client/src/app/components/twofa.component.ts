import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OtpService } from '../services/otp.service';

@Component({
  selector: 'app-twofa',
  templateUrl: './twofa.component.html',
  styleUrls: ['./twofa.component.css']
})
export class TwofaComponent implements OnInit {

  username;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private otpSvc: OtpService) { }

  ngOnInit() {
    this.username= this.activatedRoute.snapshot.params.username;
  }

  twofa(form){
    console.log("form.value=", form.value);
    this.otpSvc.authOtp(form.value['otp'], this.username)
    .then (result=>{
      console.log("authOtp=", result);
      this.router.navigate(['/list']);
    });
  }

}
