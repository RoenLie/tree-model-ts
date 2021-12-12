import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement( 'page-entrypoint' )
export class PageEntrypoint extends LitElement {

	public override render() {
		return html`
			<h1>kake</h1>
		`;
	}

}