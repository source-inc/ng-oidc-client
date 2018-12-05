import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap, filter, concatMap, first } from 'rxjs/operators';
import { OidcFacade } from 'ng-oidc-client';
import { User } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class OidcGuardService implements CanActivate {
  constructor(private router: Router, private oidcFacade: OidcFacade) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.oidcFacade.waitForAuthenticationLoaded().pipe(
      switchMap(loading => {
        return this.hasAuthenticatedUser();
      })
    );
  }

  /**
   * Check to see oidc identity exists in state
   */
  hasAuthenticatedUser(): Observable<boolean> {
    return this.oidcFacade.identity$.pipe(
      first(),
      switchMap(user => {
        // console.log('Auth Guard - Checking if user exists', user);
        // console.log('Auth Guard - Checking if user is expired:', user && user.expired);
        if (user && !user.expired) {
          return of(true);
        } else {
          this.router.navigate(['/unauthorized']);
          return of(false);
        }
      })
    );
  }
}
