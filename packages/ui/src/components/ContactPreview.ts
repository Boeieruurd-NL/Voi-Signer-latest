import { html } from 'htm/preact';
import { FunctionalComponent } from 'preact';
import { obfuscateAddress } from '@voisigner/common/utils';

const ContactPreview: FunctionalComponent = (props: any) => {
  const { contact, rightSide, style, className, action, id } = props;

  const namespace = className ? className : '';

  return html`
    <div class="box contact-preview py-2 mb-2 ${namespace}" style="color: white !important; ${style}" onClick=${action} id=${id}>
      <div style="max-width: 80%;">
        <h6 class="title is-6" style="color: white !important;">${contact.name}</h6>
        <h6 class="subtitle is-6" style="color: white !important;">${obfuscateAddress(contact.address)}</h6>
      </div>
      ${rightSide && rightSide}
    </div>
  `;

};

export default ContactPreview;
