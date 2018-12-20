import { Loona, State } from '@loona/angular';

@State({
  defaults: {
    identity: null,
    expiring: false,
    loading: false,
    errors: []
  }
})
export class OidcState {
  constructor(private loona: Loona) {}
}
