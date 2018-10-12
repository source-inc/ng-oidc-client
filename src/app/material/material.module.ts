import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatMenuModule
} from '@angular/material';

const MODULES = [
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatMenuModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MaterialModule {}
