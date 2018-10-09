import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { User as OidcUser } from 'oidc-client';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import {
  OidcActionTypes,
  OidcError,
  OnUserLoaded,
  SignInSilent,
  SilentRenewError,
  UserDoneLoading,
  UserFound,
  SignInPopup,
  SignInRedirect,
  SignInError,
  SignOutPopup,
  SignOutError,
  SignOutRedirect
} from '../actions/oidc.action';
import { OidcService } from '../services/oidc.service';
import { ACTION_NO_ACTION } from '../models';

@Injectable()
export class OidcEffects {
  constructor(private actions$: Actions, @Inject(OidcService) private oidcService: OidcService) {}

  @Effect()
  getOicdUser$ = this.actions$.pipe(
    ofType(OidcActionTypes.GetOidcUser),
    tap(() => console.log('Effect getOidcUser  - Getting user from UserManager')),
    switchMap(() =>
      this.oidcService.getOidcUser().pipe(
        tap(userData => console.log('Effect getOidcUser  - Got User', userData)),
        switchMap((userData: OidcUser) => {
          let r: Action[] = [];
          // user does not exist
          if (userData == null) {
            return r;
          }
          // user expired, initiate silent sign-in
          if (userData.expired === true) {
            r = [...r, new SignInSilent()];
          }

          r = [...r, new UserFound(userData)];
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
  removeOidcUser$ = this.actions$.pipe(
    ofType(OidcActionTypes.RemoveOidcUser),
    tap(() => console.log('Effect removeOidcUser')),
    concatMap(() => {
      return this.oidcService.removeOidcUser().pipe(
        concatMap(() => [new UserDoneLoading()]),
        catchError(error => [new OidcError(error)]) //
      );
    })
  );

  @Effect()
  userFound$ = this.actions$.pipe(
    ofType(OidcActionTypes.UserFound),
    concatMap(() => {
      return [new UserDoneLoading()];
    })
  );

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
  signInPopup$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActionTypes.SignInPopup),
    map((action: SignInPopup) => action.payload),
    concatMap(extraQueryParams => {
      return this.oidcService.signInPopup(extraQueryParams).pipe(
        concatMap((user: OidcUser) => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new SignInError(error)))
      );
    })
  );

  @Effect()
  signInRedirect$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActionTypes.SignInRedirect),
    map((action: SignInRedirect) => action.payload),
    concatMap(extraQueryParams => {
      return this.oidcService.signInRedirect(extraQueryParams).pipe(
        concatMap((user: OidcUser) => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new SignInError(error)))
      );
    })
  );

  @Effect()
  signInSilent$ = this.actions$.pipe(
    ofType(OidcActionTypes.SignInSilent),
    tap(() => console.log('Effect SignInSilent - Trigger silent signin manually')),
    switchMap(() =>
      this.oidcService.signInSilent().pipe(
        tap((userData: OidcUser) => console.log('Effect SignInSilent - Got user from silent sign in', userData)),
        switchMap((userData: OidcUser) => {
          return [new UserFound(userData)];
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

  @Effect()
  signOutPopup$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActionTypes.SignOutPopup),
    map((action: SignOutPopup) => action.payload),
    concatMap(extraQueryParams => {
      return this.oidcService.signOutPopup(extraQueryParams).pipe(
        concatMap(() => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new SignOutError(error)))
      );
    })
  );

  @Effect()
  signOutRedirect$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActionTypes.SignOutRedirect),
    map((action: SignOutRedirect) => action.payload),
    concatMap(extraQueryParams => {
      return this.oidcService.signOutRedirect(extraQueryParams).pipe(
        concatMap(() => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new SignOutError(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  onUserSignedOut$ = this.actions$.pipe(
    ofType(OidcActionTypes.OnUserSignedOut),
    tap(() => console.log('Effect OnUserSignedOut'))
  );
}
