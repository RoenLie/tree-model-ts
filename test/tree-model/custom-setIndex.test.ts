import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';


const customConfig_setIndex = suite( 'setIndex(), with custom configuration', {
	options: {
		childKey:    'deps',
		modelSortFn: ( a, b ) => Number( b.id ) - Number( a.id ),
	},
} );


customConfig_setIndex( 'should throw an error when setting a node index but a comparator was provided', ( context ) => {
	const root = TreeModel.parse( { id: 1, deps: [ { id: 12 }, { id: 11 } ] }, context.options );
	const child = root.children[0];

	assert.throws(
		() => child.setIndex( 0 ),
		Error,
		'Cannot set node index when using a comparator function.',
	);
} );


customConfig_setIndex.run();