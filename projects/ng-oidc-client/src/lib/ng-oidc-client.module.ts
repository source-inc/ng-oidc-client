import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OidcEffects } from './effects/oidc.effect';
import { Config, OIDC_CONFIG } from './models/config.model';
import { oidcReducer } from './reducers/oidc.reducer';
import { OidcFacade } from './facades/oidc.facade';
import { OidcService } from './services/oidc.service';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature('oidc', oidcReducer), EffectsModule.forFeature([OidcEffects])],
  declarations: [],
  providers: []
})
export class NgOidcClientModule {
  static forRoot(config?: Partial<Config>): ModuleWithProviders<NgOidcClientModule> {
    return {
      ngModule: NgOidcClientModule,
      providers: [{ provide: OIDC_CONFIG, useValue: config }, OidcFacade, OidcService]
    };
  }
}
