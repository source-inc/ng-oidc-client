import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { OidcFacade } from 'ng-oidc-client';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OidcGuardService implements CanActivate {
  constructor(private router: Router, private oidcFacade: OidcFacade) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.hasAuthenticatedUser();
  }

  /**
   * Check to see oidc identity exists in state
   */
  hasAuthenticatedUser(): Observable<boolean> {
    return this.oidcFacade.identity$.pipe(
      take(1),
      switchMap(user => {
        console.log('Auth Guard - Checking if user exists', user);
        console.log('Auth Guard - Checking if user is expired:', user && user.expired);
        if (user && !user.expired) {
          return of(true);
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}
