import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


const defaultConfig_hasChildren = suite( 'hasChildren(), with default configuration', { root: undefined as Node<any> } );

defaultConfig_hasChildren.before.each( ( context ) => {
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

defaultConfig_hasChildren( 'should return true for node with children', ( { root } ) => {
	assert.equal( root.hasChildren, true );
} );

defaultConfig_hasChildren( 'should return false for node without children', ( { root } ) => {
	assert.equal( root.first( idEq( 111 ) ).hasChildren, false );
} );

defaultConfig_hasChildren.run();