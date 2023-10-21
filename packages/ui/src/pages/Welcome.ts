import { FunctionalComponent } from "preact";
import { html } from 'htm/preact';
import { Link } from 'preact-router';

import background from 'assets/background.png';
import logo from 'assets/logo.png';

const Welcome: FunctionalComponent = (props) => {

  return html`
  <div class="main-view has-text-white"
  style="flex-direction: column; justify-content: space-between; background:url(${background}); background-size: cover;">
  <div style="flex: 1">

    <section class="section pt-4 has-text-centered">
      <img src=${logo} class="py-1" width="200" />

      <h1 class="title is-4 mb-0 has-text-white"> <!-- Changed from is-6 to is-4 -->
        Welcome to Voi Signer
      </h1>
    </section>

    <section class="section pt-4 has-text-centered"> <!-- Added has-text-centered class -->
      <p>
      Voi-Signer is your new way to sign and create transactions on the VOI network.
      </p>
      <p class="mt-4">
        It is also a hot wallet for VOI currency, and can manage assets on the network.
      </p>
    </section>
  </div>

  <div class="mx-5 mb-3">
    <${Link} id="setPassword" class="button is-link is-fullwidth" href="/set-password">
      Get started
    <//>
  </div>
</div>

  `
}

export default Welcome;