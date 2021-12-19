import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';


@customElement( 'tree-node' )
export class TreeNode extends LitElement {

	@property( { type: Number } )
	public nodeId = 0;

	@property( { type: Number } )
	public size = 5;

	@property( { type: Boolean } )
	public active = false;

	public override render() {
		const styles: StyleInfo = {
			fontSize: this.size + 'rem',
			height:   this.size + 'rem',
			width:    this.size + 'rem',
		};

		return html`
		<div style=${styleMap( styles )}>
			<svg viewBox="0 0 400 400">
				<g transform="translate(200, 200)">
					<circle cx="0" cy="0" r="200" fill="${this.active ? 'blue' : 'darkOrange'}"></circle>
				</g>
			</svg>
			<span>${this.nodeId}</span>
		</div>
		`;
	}

	public static override styles = [
		css`
			div {
				display: grid;
				place-items: center;
				font-weight: bold;
			}
			div span {
				position: absolute;
				font-size: 0.7em;
			}
		`,
	];

}