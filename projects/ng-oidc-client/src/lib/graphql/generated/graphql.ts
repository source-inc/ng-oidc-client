export type Maybe<T> = T | null;

export interface ProfileInput {
  name?: Maybe<string>;

  sid?: Maybe<string>;
}

export interface NgOidcInfoInput {
  expiring?: Maybe<boolean>;

  loading?: Maybe<boolean>;
}

// ====================================================
// Documents
// ====================================================

export namespace Identity {
  export type Variables = {};

  export type Query = {
    __typename?: 'Query';

    identity: Maybe<Identity>;
  };

  export type Identity = IdentityFields.Fragment;
}

export namespace AddIdentity {
  export type Variables = {
    id_token: string;
    access_token: string;
    profile?: Maybe<ProfileInput>;
  };

  export type Mutation = {
    __typename?: 'Mutation';

    addIdentity: Maybe<AddIdentity>;
  };

  export type AddIdentity = IdentityFields.Fragment;
}

export namespace UpdateNgOidcInfo {
  export type Variables = {
    info?: Maybe<NgOidcInfoInput>;
  };

  export type Mutation = {
    __typename?: 'Mutation';

    updateNgOidcInfo: Maybe<UpdateNgOidcInfo>;
  };

  export type UpdateNgOidcInfo = NgOidcInfoFields.Fragment;
}

export namespace NgOidcInfo {
  export type Variables = {};

  export type Query = {
    __typename?: 'Query';

    ngOidcInfo: Maybe<NgOidcInfo>;
  };

  export type NgOidcInfo = NgOidcInfoFields.Fragment;
}

export namespace IdentityFields {
  export type Fragment = {
    __typename?: 'Identity';

    id_token: Maybe<string>;

    access_token: Maybe<string>;

    profile: Maybe<Profile>;
  };

  export type Profile = {
    __typename?: 'Profile';

    name: Maybe<string>;

    sid: Maybe<string>;
  };
}

export namespace NgOidcInfoFields {
  export type Fragment = {
    __typename?: 'NgOidcInfo';

    expiring: Maybe<boolean>;

    loading: Maybe<boolean>;
  };
}

// ====================================================
// START: Apollo Angular template
// ====================================================

import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';

import gql from 'graphql-tag';

// ====================================================
// GraphQL Fragments
// ====================================================

export const IdentityFieldsFragment = gql`
  fragment IdentityFields on Identity {
    id_token
    access_token
    profile {
      name
      sid
    }
  }
`;

export const NgOidcInfoFieldsFragment = gql`
  fragment NgOidcInfoFields on NgOidcInfo {
    expiring
    loading
  }
`;

// ====================================================
// Apollo Services
// ====================================================

@Injectable({
  providedIn: 'root'
})
export class IdentityGQL extends Apollo.Query<Identity.Query, Identity.Variables> {
  document: any = gql`
    query identity {
      identity @client {
        ...IdentityFields
      }
    }

    ${IdentityFieldsFragment}
  `;
}
@Injectable({
  providedIn: 'root'
})
export class AddIdentityGQL extends Apollo.Mutation<AddIdentity.Mutation, AddIdentity.Variables> {
  document: any = gql`
    mutation addIdentity($id_token: String!, $access_token: String!, $profile: ProfileInput) {
      addIdentity(id_token: $id_token, access_token: $access_token, profile: $profile) @client {
        ...IdentityFields
      }
    }

    ${IdentityFieldsFragment}
  `;
}
@Injectable({
  providedIn: 'root'
})
export class UpdateNgOidcInfoGQL extends Apollo.Mutation<UpdateNgOidcInfo.Mutation, UpdateNgOidcInfo.Variables> {
  document: any = gql`
    mutation updateNgOidcInfo($info: NgOidcInfoInput) {
      updateNgOidcInfo(info: $info) @client {
        ...NgOidcInfoFields
      }
    }

    ${NgOidcInfoFieldsFragment}
  `;
}
@Injectable({
  providedIn: 'root'
})
export class NgOidcInfoGQL extends Apollo.Query<NgOidcInfo.Query, NgOidcInfo.Variables> {
  document: any = gql`
    query ngOidcInfo {
      ngOidcInfo @client {
        ...NgOidcInfoFields
      }
    }

    ${NgOidcInfoFieldsFragment}
  `;
}

// ====================================================
// END: Apollo Angular template
// ====================================================
