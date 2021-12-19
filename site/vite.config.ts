import { defineConfig } from 'vite';


export default defineConfig( {
	plugins: [
		{
			enforce: 'pre',
			name:    'change-asset-lookup',
			transformIndexHtml( html ) {
				html = html.replace( /"\/assets/g, '/tree-model-ts/assets' );

				return html;
			},

		},
	],
	build: { outDir: '../docs', emptyOutDir: true },
} );