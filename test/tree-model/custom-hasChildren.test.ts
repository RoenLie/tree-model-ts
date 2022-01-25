import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


const customConfig_hasChildren = suite( 'hasChildren(), with custom configuration', {
	root:        undefined as Node<any>,
	modelSortFn: ( a, b ) => Number( b.id ) - Number( a.id ),
} );

customConfig_hasChildren.before.each( ( context ) => {
	const options = {
		childKey:    'deps',
		modelSortFn: context.modelSortFn,
	};

	context.root = TreeModel.parse( {
		id:   1,
		deps: [
			{
				id:   11,
				deps: [ { id: 111 } ],
			},
			{
				id:   12,
				deps: [ { id: 121 }, { id: 122 } ],
			},
		],
	}, options );
} );


customConfig_hasChildren( 'should return true for node with children', ( { root } ) => {
	assert.equal( root.hasChildren, true );
} );


customConfig_hasChildren( 'should return false for node without children', ( { root } ) => {
	assert.equal( root.first( idEq( 111 ) ).hasChildren, false );
} );


customConfig_hasChildren.run();