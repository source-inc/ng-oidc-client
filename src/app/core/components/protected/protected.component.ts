import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtectedComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  getUser() {
    console.log('getUser()');
  }
}
