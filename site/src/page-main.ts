import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TreeNode } from './components/node';

TreeNode;

import 'https://cdn.jsdelivr.net/gh/vanillawc/wc-codemirror@latest/index.js';
import 'https://cdn.jsdelivr.net/gh/vanillawc/wc-codemirror@latest/mode/javascript/javascript.js';

document?.querySelector( 'head' )?.insertAdjacentHTML( 'beforeend', `https://cdn.jsdelivr.net/gh/vanillawc/wc-codemirror@latest/theme/monokai.css" />` );

// prettier-ignore
export const Basic = () => html`
  <wc-codemirror></wc-code-mirror>
`;

// prettier-ignore
export const Inline = () => html`
  <wc-codemirror mode="javascript">
    <script type="wc-content">
      function myGoodPerson(){
        return "what can I do for you ?"
      }
    </script>
  </wc-codemirror>
`;

// prettier-ignore
export const Src = () => html`
  <wc-codemirror src="sample.js"></wc-code-mirror>
`;

// prettier-ignore
export const Mode = () => html`
  <wc-codemirror src="sample.js" mode="javascript"></wc-code-mirror>
`;

// prettier-ignore
export const Theme = () => html`
  <wc-codemirror src="sample.js" mode="javascript" theme="monokai"></wc-code-mirror>
`;


@customElement( 'page-entrypoint' )
export class PageEntrypoint extends LitElement {

	public override render() {
		return html`
			<h1>kake</h1>
			<tree-node></tree-node>
			<wc-codemirror mode="javascript">
				<script type="wc-content">
					function myGoodPerson(){
						return "what can I do for you ?"
					}
				</script>
			</wc-codemirror>
		`;
	}

}