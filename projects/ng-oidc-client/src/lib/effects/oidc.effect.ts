import { Injectable, Inject, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store/src/models';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { OidcActions } from '../actions';
import { toSerializedUser } from '../oidc.utils';
import { OidcService } from '../services/oidc.service';
import { Config, OIDC_CONFIG } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OidcEffects {
  constructor(private actions$: Actions, private oidcService: OidcService) {}

  getOicdUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.GetOidcUser),
      concatMap(({ payload }) =>
        this.oidcService.getOidcUser().pipe(
          concatMap(user => {
            const actions: Observable<Action>[] = [of(OidcActions.UserFound({ payload: toSerializedUser(user) }))];
            if (user != null && user.expired === true) {
              actions.push(of(OidcActions.SigninSilent({ payload })));
            }
            return merge(...actions);
          }),
          catchError(() => of(OidcActions.UserDoneLoading()))
        )
      )
    )
  );

  userFound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.UserFound),
      map(() => OidcActions.UserDoneLoading())
    )
  );

  onUserLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.OnUserLoaded),
      map(({ payload }) => OidcActions.UserFound({ payload }))
    )
  );

  signInPopup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.SigninPopup),
      concatMap(({ payload }) =>
        this.oidcService.signInPopup(payload).pipe(
          concatMap(user => EMPTY),
          catchError(error => of(OidcActions.SignInError({ payload: error.message })))
        )
      )
    )
  );

  signInRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.SigninRedirect),
      concatMap(({ payload }) =>
        this.oidcService.signInRedirect(payload).pipe(
          concatMap(() => EMPTY),
          catchError(error => {
            return of(OidcActions.SignInError({ payload: error.message }));
          })
        )
      )
    )
  );

  signInSilent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.SigninSilent),
      switchMap(({ payload }) =>
        this.oidcService.signInSilent(payload).pipe(
          map(user => OidcActions.UserFound({ payload: toSerializedUser(user) })),
          // Something went wrong renewing the access token.
          // Set loading done so the auth guard will resolve.
          catchError(error =>
            of(OidcActions.OnSilentRenewError({ payload: error.message }), OidcActions.UserDoneLoading())
          )
        )
      )
    )
  );

  signOutPopup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.SignoutPopup),
      switchMap(({ payload }) =>
        this.oidcService.signOutPopup(payload).pipe(
          concatMap(() => EMPTY),
          catchError(error => of(OidcActions.SignOutError({ payload: error.message })))
        )
      )
    )
  );

  signOutRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OidcActions.SignOutRedirect),
      switchMap(({ payload }) =>
        this.oidcService.signOutRedirect(payload).pipe(
          concatMap(() => EMPTY),
          catchError(error => of(OidcActions.SignOutError({ payload: error.message })))
        )
      )
    )
  );
}
