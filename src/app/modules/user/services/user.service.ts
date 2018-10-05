import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User, USER_CONFIG, Config } from '../models';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, @Inject(USER_CONFIG) private config: Config) {}

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.config.urls.api}/connect/userinfo`);
  }
}
