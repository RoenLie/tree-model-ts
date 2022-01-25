import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import type { Node } from '../../src/Node';


const defaultConfig_first = suite( 'first(), with default configuration', { root: undefined as Node<any> } );

defaultConfig_first.before.each( ( context ) => {
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


defaultConfig_first( 'should get the first node when the predicate returns true', ( { root } ) => {
	const first = root.first( () => {
		return true;
	} );
	assert.equal( first.model.id, 1 );
} );


defaultConfig_first( 'should get the first node when no predicate is given', ( { root } ) => {
	const first = root.first();
	assert.equal( first.model.id, 1 );
} );


defaultConfig_first( 'should get the first node with a different strategy when the predicate returns true', ( { root } ) => {
	const first = root.first( null, { strategy: 'post' } );
	assert.equal( first.model.id, 111 );
} );


defaultConfig_first( 'should get the first node with a different strategy when no predicate is given', ( { root } ) => {
	const first = root.first( null, { strategy: 'post' } );
	assert.equal( first.model.id, 111 );
} );


defaultConfig_first.run();