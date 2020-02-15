import { URL } from 'url'
import { Lincoln } from '@nofrills/lincoln-debug'
import { RestResource } from '@nativecode/rest-client'

import { AuthenticationRequest } from '../Models/AuthenticationRequest'
import { AuthenticationResponse } from '../Models/AuthenticationResponse'

export interface AuthenticationTokenCallback {
  (token: string): void
}

export class Authentication extends RestResource {
  constructor(url: URL, logger: Lincoln, private readonly callback: AuthenticationTokenCallback) {
    super(url, logger)
  }

  async login(username: string, password: string): Promise<string> {
    const response = await this.http_post<AuthenticationRequest, AuthenticationResponse>('users/login/', {
      username,
      password,
    })

    this.callback(response.token)

    return response.token
  }
}
