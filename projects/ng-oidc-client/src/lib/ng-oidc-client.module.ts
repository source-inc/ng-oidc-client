import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OidcEffects } from './effects/oidc.effect';
import { OidcFacade } from './facades/oidc.facade';
import { Config, OIDC_CONFIG } from './models/config.model';
import { oidcReducer } from './reducers/oidc.reducer';
import { OidcService } from './services/oidc.service';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature('oidc', oidcReducer), EffectsModule.forFeature([OidcEffects])],
  declarations: [],
  providers: [OidcEffects]
})
export class NgOidcClientModule {
  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: NgOidcClientModule,
      providers: [
        { provide: OIDC_CONFIG, useValue: config },
        { provide: OidcService, useClass: OidcService, deps: [OIDC_CONFIG, PLATFORM_ID] },
        { provide: OidcFacade, useClass: OidcFacade }
      ]
    };
  }
}
