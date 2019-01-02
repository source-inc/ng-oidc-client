import { Loona, State, Update, Mutation, Context } from '@loona/angular';
import { OidcActions } from '../actions/index';
import { IdentityGQL, UpdateNgOidcInfoGQL, NgOidcInfoGQL } from '../graphql/generated/graphql';
import { OnAccessTokenExpiring } from '../actions/oidc.action';

@State({
  defaults: {
    identity: null,
    ngOidcInfo: {
      __typename: 'NgOidcInfo',
      expiring: true,
      loading: false
    }
  }
})
export class OidcState {
  constructor(private loona: Loona, private identityGQL: IdentityGQL, private ngOidcInfoGQL: NgOidcInfoGQL) {}

  @Mutation(OidcActions.UserFound)
  onUserFound(identity, ctx: Context) {
    identity.__typename = 'Identity';
    identity.profile.__typename = 'Profile';
    return identity;
  }

  @Update(OidcActions.UserFound)
  updateIdentity(mutation, ctx: Context) {
    ctx.patchQuery(this.identityGQL.document, state => {
      state.identity = mutation.result;
    });
  }

  @Mutation(OidcActions.OnAccessTokenExpiring)
  onAccessTokenExpiring(mutation, ctx: Context) {
    console.log('@Mutation onAccessTokenExpiring', mutation);
    mutation.__typename = 'NgOidcInfo';
    mutation.expiring = true;
    mutation.loading = null;
    return mutation;
  }

  @Update(OidcActions.OnAccessTokenExpiring)
  updateAccessTokenExpiring(_, ctx: Context) {
    console.log('@Update onAccessTokenExpiring');
    ctx.patchQuery(this.ngOidcInfoGQL.document, state => {
      if (state.ngOidcInfo == null) {
        state.ngOidcInfo = {
          __typename: 'NgOidcInfo',
          expiring: true,
          loading: false
        };
      }
      state.ngOidcInfo.expiring = true;
    });
  }
}
