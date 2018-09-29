import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { User as OidcUser } from 'oidc-client';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  OidcActionTypes,
  SignInSilent,
  SilentRenewError,
  UserDoneLoading,
  UserFound,
  OnUserLoaded,
  OnIdentityChanged,
  OnIdentityEstablished,
  OnIdentityRemoved
} from '../actions/oidc.action';
import { OidcService } from '../services/oidc.service';
import { Action } from '@ngrx/store';

@Injectable()
export class OidcEffects {
  constructor(
    private actions$: Actions,
    @Inject(OidcService) private oidcService: OidcService,
    private router: Router
  ) {}

  @Effect()
  onUserLoaded$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActionTypes.OnUserLoaded),
    map((action: OnUserLoaded) => action.payload),
    tap((userData: OidcUser) => console.log('Effect onUserLoaded - ', { userData })),
    switchMap((userData: OidcUser) => {
      return [new UserFound(userData)];
    })
  );

  @Effect()
  signInSilent$ = this.actions$.pipe(
    ofType(OidcActionTypes.SignInSilent),
    tap(() => console.log('Effect SignInSilent - Trigger silent signin manually')),
    switchMap(() =>
      this.oidcService.signinSilent().pipe(
        tap((userData: OidcUser) => console.log('Effect SignInSilent - Got user from silent sign in', userData)),
        switchMap((userData: OidcUser) => {
          return [new UserFound(userData), new OnIdentityChanged(), new OnIdentityEstablished()];
        }),
        catchError(error => {
          console.log('Effect SignInSilent - Caught error silent renew', error);
          // Something went wrong renewing the access token.
          // Set loading done so the auth guard will resolve.
          return of(new SilentRenewError(error), new UserDoneLoading());
        })
      )
    )
  );

  @Effect({ dispatch: false })
  signInSilentError$ = this.actions$.pipe(
    ofType(OidcActionTypes.SilentRenewError),
    tap(error => console.log('Effect SilentRenewError - There was an error renewing user token', error))
  );

  @Effect()
  getOicdUser$ = this.actions$.pipe(
    ofType(OidcActionTypes.GetOidcUser),
    tap(() => console.log('Effect getOidcUser  - Getting user from UserManager')),
    switchMap(() =>
      this.oidcService.getOidcUser().pipe(
        tap(userData => console.log('Effect getOidcUser  - Got User', userData)),
        switchMap((userData: OidcUser) => {
          const r: Action[] = [new UserFound(userData)];

          if (userData && userData.expired === true) {
            console.log(
              '%c Effect getOidcUser  - User HAS expired dispatch sign in silent action',
              'background: #222; color: #bada55; padding: 10px;'
            );
            r.push(new SignInSilent());
          } else if (userData && !userData.expired) {
            r.push(new UserDoneLoading(), new OnIdentityChanged(), new OnIdentityEstablished());
          } else {
            console.log(
              `%c Effect getOidcUser  - User ${
                userData ? `exists and HAS NOT expired yet` : `doesn't exist`
              } return done loading action`,
              'background: #222; color: #bada55; padding: 10px;'
            );
            r.push(new UserDoneLoading());
          }

          return r;
        }),
        catchError(error => {
          console.log('Effect getOidcUser - Caught error get user', error);
          return of(new UserDoneLoading());
        })
      )
    )
  );

  @Effect()
  onUserSignedOut$ = this.actions$.pipe(
    ofType(OidcActionTypes.OnUserSignedOut),
    tap(() => console.log('Effect OnUserSignedOut')),
    switchMap(() => [new OnIdentityRemoved()])
  );
}
