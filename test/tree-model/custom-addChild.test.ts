import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';

type Blank = {
	id: number;
	stable?: number;
	deps?: Blank[];
}

const customConfig_addChild = suite( 'addChild(), with custom configuration', {
	options: {
		childKey:    'deps',
		modelSortFn: ( a, b ) => Number( b.id ) - Number( a.id ),
	},
} );


customConfig_addChild( 'should add child respecting the given comparator', ( context ) => {
	const root = TreeModel.parse<Blank>( {
		id:   1,
		deps: [
			{ id: 12, stable: 1 },
			{ id: 11, stable: 1 },
			{ id: 11, stable: 2 },
			{ id: 11, stable: 3 },
			{ id: 11, stable: 4 },
			{ id: 11, stable: 5 },
			{ id: 11, stable: 6 },
			{ id: 11, stable: 7 },
			{ id: 12, stable: 2 },
			{ id: 11, stable: 8 },
			{ id: 11, stable: 9 },
			{ id: 11, stable: 10 },
			{ id: 11, stable: 11 },
			{ id: 11, stable: 12 },
			{ id: 11, stable: 13 },
			{ id: 11, stable: 14 },
			{ id: 11, stable: 15 },
			{ id: 13, stable: 1 },
			{ id: 12, stable: 3 },
		],
	}, context.options );

	root.addChild( TreeModel.parse<Blank>( { id: 13, stable: 2 }, context.options ) );
	root.addChild( TreeModel.parse<Blank>( { id: 10, stable: 1 }, context.options ) );
	root.addChild( TreeModel.parse<Blank>( { id: 10, stable: 2 }, context.options ) );
	root.addChild( TreeModel.parse<Blank>( { id: 12, stable: 4 }, context.options ) );
	assert.lengthOf( root.children, 23 );
	assert.deepEqual( root.model.deps, [
		{ id: 13, stable: 1 },
		{ id: 13, stable: 2 },
		{ id: 12, stable: 1 },
		{ id: 12, stable: 2 },
		{ id: 12, stable: 3 },
		{ id: 12, stable: 4 },
		{ id: 11, stable: 1 },
		{ id: 11, stable: 2 },
		{ id: 11, stable: 3 },
		{ id: 11, stable: 4 },
		{ id: 11, stable: 5 },
		{ id: 11, stable: 6 },
		{ id: 11, stable: 7 },
		{ id: 11, stable: 8 },
		{ id: 11, stable: 9 },
		{ id: 11, stable: 10 },
		{ id: 11, stable: 11 },
		{ id: 11, stable: 12 },
		{ id: 11, stable: 13 },
		{ id: 11, stable: 14 },
		{ id: 11, stable: 15 },
		{ id: 10, stable: 1 },
		{ id: 10, stable: 2 },
	] );
} );

customConfig_addChild( 'should keep child nodes and model child nodes positions in sync', ( context ) => {
	const root = TreeModel.parse<Blank>( { id: 1, deps: [ { id: 12 }, { id: 11 } ] }, context.options );

	root.addChild( TreeModel.parse<Blank>( { id: 13 }, context.options ) );
	root.addChild( TreeModel.parse<Blank>( { id: 10 }, context.options ) );

	assert.lengthOf( root.children, 4 );

	assert.deepEqual( root.model.deps, [ { id: 13 }, { id: 12 }, { id: 11 }, { id: 10 } ] );

	assert.equal( root.children[0].model.id, 13 );
	assert.equal( root.children[1].model.id, 12 );
	assert.equal( root.children[2].model.id, 11 );
	assert.equal( root.children[3].model.id, 10 );
} );

customConfig_addChild( 'should throw an error when adding child at index but a comparator was provided', ( context ) => {
	const root = TreeModel.parse<Blank>( { id: 1, deps: [ { id: 12 }, { id: 11 } ] }, context.options );
	const child = TreeModel.parse<Blank>( { id: 13 }, context.options );

	assert.throws(
		root.addChildAtIndex.bind( root, child, 1 ),
		Error,
		'Cannot add child at index when using a comparator function.',
	);
} );

customConfig_addChild.run();