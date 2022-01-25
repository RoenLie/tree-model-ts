import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


const defaultConfig_drop = suite( 'drop(), with default configuration', { root: undefined as Node<any> } );

defaultConfig_drop.before.each( ( context ) => {
	context.root = TreeModel.parse( {
		id:       1,
		children: [
			{
				id:       11,
				children: [ { id: 111 } ],
			},
			{
				id:       12,
				children: [ { id: 121 }, { id: 122 } ],
			},
		],
	} );
} );


defaultConfig_drop( 'should give back the dropped node, even if it is the root', ( { root } ) => {
	assert.deepEqual( root.drop(), root );
} );


defaultConfig_drop( 'should give back the dropped node, which no longer be found in the original root', ( { root } ) => {
	assert.deepEqual( root.first( idEq( 11 ) ).drop().model, { id: 11, children: [ { id: 111 } ] } );
	assert.isUndefined( root.first( idEq( 11 ) ) );
} );


defaultConfig_drop.run();