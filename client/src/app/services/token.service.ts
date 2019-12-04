import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private authenticatedLogin: boolean;

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticatedLogin():boolean{
    return this.authenticatedLogin;
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
        this.authenticatedLogin = true;
        return true;
        }
      )
      .catch((err)=>{
        this.authenticatedLogin = false;
        return false;
        }
      )
    )
  }

  // route guard
  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authenticatedLogin){
      this.router.navigate(['/login']);
    }
    console.log("in canActivate. authenticated login=", this.authenticatedLogin);
    return (this.authenticatedLogin);
  }
}
