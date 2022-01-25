import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


const customConfig_drop = suite( 'drop(), with custom configuration', {
	root:    undefined as Node<any>,
	options: {
		childKey:    'deps',
		modelSortFn: ( a, b ) => Number( b.id ) - Number( a.id ),
	},
} );

customConfig_drop.before.each( ( context ) => {
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
	}, context.options );
} );


customConfig_drop( 'should give back the dropped node, even if it is the root', ( { root } ) => {
	assert.deepEqual( root.drop(), root );
} );


customConfig_drop( 'should give back the dropped node, which no longer be found in the original root', ( { root } ) => {
	assert.deepEqual( root.first( idEq( 11 ) ).drop().model, { id: 11, deps: [ { id: 111 } ] } );
	assert.isUndefined( root.first( idEq( 11 ) ) );
} );


customConfig_drop.run();