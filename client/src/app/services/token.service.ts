import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private authenticated : boolean;
  private token: string;
  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated():boolean{
    return this.authenticated;
  }

  // route guard
  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if (!this.authenticated){
      this.router.navigate(['/login']);
    }
    console.log("in canActivate. authenticated=", this.authenticated);
    return (this.authenticated);
  }

  getCustomers():Promise<any>{
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.token}`)
    return (
      this.http.get('/customers, {headers}').toPromise()
    )
  }

  authenticate(username:string, password: string): Promise<boolean>{
    const params = new HttpParams()
    .set('username', username)
    .set('password', password);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return (
      this.http.post('/authenticate', params.toString(), {headers})
      .toPromise()
      .then((result: any) => {
        this.authenticated = true;
        this.token = result.access_token;
        console.log("in service. authenticated=", this.authenticated);
        return result;
        }
      )
      .catch((err)=>{
        this.authenticated = false;
        console.log("in service. authenticated=", this.authenticated);
        return err;
        }
      )
      
    )
  }
}
