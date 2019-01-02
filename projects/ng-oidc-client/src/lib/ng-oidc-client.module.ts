import { ModuleWithProviders, PLATFORM_ID, NgModule } from '@angular/core';
import { LoonaLink, LOONA_CACHE, LoonaModule } from '@loona/angular';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { OidcFacade } from './facades/oidc.facade';
import { Config, OIDC_CONFIG } from './models/config.model';
import { OidcService } from './services/oidc.service';
import { CommonModule } from '@angular/common';
import { OidcState } from './loona/oidc.state';

export function provideApollo(
  httpLink: HttpLink,
  loonaLink: LoonaLink,
  cache: InMemoryCache
): ApolloClientOptions<any> {
  const link = ApolloLink.from([loonaLink]);

  return {
    link: link,
    cache: cache,
    connectToDevTools: true
  };
}

@NgModule({
  imports: [CommonModule, HttpLinkModule, LoonaModule.forChild([OidcState])],
  exports: [ApolloModule, HttpLinkModule, LoonaModule],
  declarations: [],
  providers: [
    {
      provide: LOONA_CACHE,
      useFactory() {
        const cache = new InMemoryCache();
        // persistCache({
        //   cache,
        //   storage: window.localStorage
        // });
        return cache;
      }
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink, LoonaLink, LOONA_CACHE]
    }
  ]
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
