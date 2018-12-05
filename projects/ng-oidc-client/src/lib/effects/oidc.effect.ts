import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { User as OidcUser } from 'oidc-client';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { OidcActions } from '../actions';
import { Config, OIDC_CONFIG } from '../models/config.model';
import { ACTION_NO_ACTION } from '../models/constants';
import { OidcService } from '../services/oidc.service';

@Injectable()
export class OidcEffects {
  constructor(
    private actions$: Actions,
    @Inject(OidcService) private oidcService: OidcService,
    @Inject(OIDC_CONFIG) private config: Config
  ) {}

  @Effect()
  getOicdUser$ = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.GetOidcUser),
    map((action: OidcActions.GetOidcUser) => action.payload),
    concatMap(args =>
      this.oidcService.getOidcUser().pipe(
        concatMap((userData: OidcUser) => {
          const r: Action[] = [new OidcActions.UserFound(userData)];
          const automaticSilentRenew =
            this.config.oidc_config.automaticSilentRenew != null && this.config.oidc_config.automaticSilentRenew;
          // user expired, initiate silent sign-in if configured to automatic
          if (userData != null && userData.expired === true && automaticSilentRenew === true) {
            r.push(new OidcActions.SigninSilent(args));
          }
          return r;
        }),
        catchError(error => {
          return of(new OidcActions.UserDoneLoading());
        })
      )
    )
  );
  @Effect()
  removeOidcUser$ = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.RemoveOidcUser),
    concatMap(() => {
      return this.oidcService.removeOidcUser().pipe(
        concatMap(() => [new OidcActions.UserDoneLoading()]),
        catchError(error => [new OidcActions.OidcError(error)]) //
      );
    })
  );

  @Effect()
  userFound$ = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.UserFound),
    concatMap(() => {
      return [new OidcActions.UserDoneLoading()];
    })
  );

  @Effect()
  onUserLoaded$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.OnUserLoaded),
    map((action: OidcActions.OnUserLoaded) => action.payload),
    switchMap((userData: OidcUser) => {
      return [new OidcActions.UserFound(userData)];
    })
  );

  @Effect()
  signInPopup$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.SignInPopup),
    map((action: OidcActions.SigninPopup) => action.payload),
    concatMap(args => {
      return this.oidcService.signInPopup(args).pipe(
        concatMap((user: OidcUser) => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new OidcActions.SignInError(error)))
      );
    })
  );

  @Effect()
  signInRedirect$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.SignInRedirect),
    map((action: OidcActions.SigninRedirect) => action.payload),
    concatMap(args => {
      return this.oidcService.signInRedirect(args).pipe(
        concatMap((user: OidcUser) => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new OidcActions.SignInError(error)))
      );
    })
  );

  @Effect()
  signInSilent$ = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.SignInSilent),
    map((action: OidcActions.SigninSilent) => action.payload),
    concatMap(args => {
      return this.oidcService.signInSilent(args).pipe(
        concatMap((userData: OidcUser) => {
          return [new OidcActions.UserFound(userData)];
        }),
        catchError(error => {
          // Something went wrong renewing the access token.
          // Set loading done so the auth guard will resolve.
          return of(new OidcActions.OnSilentRenewError(error), new OidcActions.UserDoneLoading());
        })
      );
    })
  );

  @Effect()
  signOutPopup$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.SignOutPopup),
    map((action: OidcActions.SignoutPopup) => action.payload),
    concatMap(args => {
      return this.oidcService.signOutPopup(args).pipe(
        concatMap(() => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new OidcActions.SignOutError(error)))
      );
    })
  );

  @Effect()
  signOutRedirect$: Observable<Action> = this.actions$.pipe(
    ofType(OidcActions.OidcActionTypes.SignOutRedirect),
    map((action: OidcActions.SignoutRedirect) => action.payload),
    concatMap(args => {
      return this.oidcService.signOutRedirect(args).pipe(
        concatMap(() => of({ type: ACTION_NO_ACTION })), // dispatch empty action
        catchError(error => of(new OidcActions.SignOutError(error)))
      );
    })
  );
}
