import { Injectable } from '@nestjs/common';

import { Config, OnEvent } from '../../base';

@Injectable()
export class CustomerIoService {
  // CustomerIO completely disabled for air-gap deployment

  constructor(private readonly config: Config) {}

  @OnEvent('config.init')
  setup() {
    // Disable all CustomerIO functionality
    console.log('CustomerIO disabled for local deployment');
  }

  @OnEvent('config.changed')
  onConfigChanged(event: Events['config.changed']) {
    // No-op - CustomerIO remains disabled
  }

  @OnEvent('user.created')
  @OnEvent('user.updated')
  async onUserUpdated(user: Events['user.updated'] | Events['user.created']) {
    // No external user tracking
    console.log('CustomerIO tracking disabled');
  }

  @OnEvent('user.deleted')
  async onUserDeleted(user: Events['user.deleted']) {
    // No external user tracking
    console.log('CustomerIO tracking disabled');
  }
}
