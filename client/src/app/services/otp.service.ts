import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private authenticatedOtp: boolean;
  private token: string;
  constructor(private http: HttpClient, private router: Router) { }

  getCustomers():Promise<any>{
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.token}`)
    return (
      this.http.get('/customers', {headers}).toPromise()
    )
  }

  authOtp(otp:string, username: string): Promise<boolean>{
    const params = new HttpParams()
      .set('username', username)
      .set('otp', otp);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return (
      this.http.post('/authOtp', params.toString(), {headers})
      .toPromise()
      .then((result: any) => {
        this.authenticatedOtp = true;
        this.token = result.access_token;
        return true;
        }
      )
      .catch((err)=>{
        this.authenticatedOtp = false;
        this.token = '';
        return false;
        }
      )
    )
  }

  // route guard
  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authenticatedOtp){
      this.router.navigate(['/login']);
    }
    console.log("in canActivate. authenticated otp=", this.authenticatedOtp);
    return (this.authenticatedOtp);
  }
}
