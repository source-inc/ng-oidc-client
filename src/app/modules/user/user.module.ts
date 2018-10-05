import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, USER_CONFIG } from './models';
import { UserService } from './services/user.service';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './reducers/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './effects/user.effect';
import { HttpClientModule } from '@angular/common/http';
import { UserFacade } from './facades/user.facade';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forFeature([UserEffects])
  ],
  exports: [CommonModule, HttpClientModule],
  declarations: [],
  providers: [UserService, UserEffects, UserFacade]
})
export class UserModule {
  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: UserModule,
      providers: [{ provide: USER_CONFIG, useValue: config }]
    };
  }
}
