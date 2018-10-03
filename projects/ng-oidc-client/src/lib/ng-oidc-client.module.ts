import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OidcEffects } from './effects/oidc.effect';
import { OidcFacade } from './facades/oidc.facade';
import { Config, OIDC_CONFIG } from './models';
import { oidcReducer } from './reducers';
import { OidcService } from './services';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature('oidc', oidcReducer), EffectsModule.forFeature([OidcEffects])],
  declarations: [],
  providers: [OidcEffects, OidcFacade, OidcService]
})
export class NgOidcClientModule {
  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: NgOidcClientModule,
      providers: [{ provide: OIDC_CONFIG, useValue: config }]
    };
  }
}
