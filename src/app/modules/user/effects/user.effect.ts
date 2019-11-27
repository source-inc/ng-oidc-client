import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';
import { GetUserMeError, GetUserMeSuccess, UserActionTypes } from '../actions/user.action';
import { User } from '../models';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  @Effect()
  loadUser$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.USER_GET_ME),
    switchMap(() =>
      this.userService.getMe().pipe(
        first(),
        map((user: User) => {
          return new GetUserMeSuccess(user);
        }),
        catchError(error => {
          console.error(error);
          return of(new GetUserMeError(error.message));
        })
      )
    )
  );
}
