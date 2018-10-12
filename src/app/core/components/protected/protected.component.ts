import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserFacade } from '../../../modules/user/facades/user.facade';
import { User } from '../../../modules/user/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtectedComponent implements OnInit {
  user$: Observable<User>;
  constructor(private userFacade: UserFacade) {
    this.user$ = this.userFacade.user$;
  }

  ngOnInit() {}

  getUser() {
    this.userFacade.getUserDetails();
  }
}
