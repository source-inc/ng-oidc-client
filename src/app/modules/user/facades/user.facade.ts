import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as userActions from '../actions/user.action';
import { getUserDetails, getUserLoading, UserState } from '../reducers/user.reducer';

@Injectable()
export class UserFacade {
  user$ = this.store.select(getUserDetails);
  loading$ = this.store.select(getUserLoading);

  constructor(private store: Store<UserState>) {}

  waitForUserLoaded(): Observable<boolean> {
    return this.loading$.pipe(
      filter(loading => loading === false),
      take(1)
    );
  }

  getUserDetails() {
    console.log('GETTING USER DETAILS');
    this.store.dispatch(new userActions.GetUserMe());
  }
}
