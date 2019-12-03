import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tokenSvc: TokenService) { }


  ngOnInit() {
    console.log("is authenticated=", this.tokenSvc.isAuthenticated());
    this.tokenSvc.getCustomers()
    .then(result=>{
      console.log("getCustomers result", result);
    })
  }

  reload(){
    this.tokenSvc.getCustomers()
    .then(result=>{
      console.log("getCustomers result", result);
    })
    .catch(err=>{
      console.log("Error=", err);
    })
  }


}
