import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';


const customConfig_parse = suite( 'parse(), with custom configuration', {
	options: {
		childKey:    'deps',
		modelSortFn: ( a, b ) => Number( b.id ) - Number( a.id ),
	},
} );


customConfig_parse( 'should create a root and stable sort the respective children according to the comparator', ( context ) => {
	const baseObject = {
		id:   1,
		deps: [
			{
				id:   11,
				deps: [ { id: 111 } ],
			},
			{
				id:   12,
				deps: [
					{ id: 122, stable: 1 },
					{ id: 121, stable: 1 },
					{ id: 121, stable: 2 },
					{ id: 121, stable: 3 },
					{ id: 121, stable: 4 },
					{ id: 121, stable: 5 },
					{ id: 121, stable: 6 },
					{ id: 121, stable: 7 },
					{ id: 121, stable: 8 },
					{ id: 121, stable: 9 },
					{ id: 121, stable: 10 },
					{ id: 121, stable: 11 },
					{ id: 121, stable: 12 },
					{ id: 121, stable: 13 },
					{ id: 121, stable: 14 },
					{ id: 121, stable: 15 },
					{ id: 122, stable: 2 },
				],
			},
		],
	};

	const root = TreeModel.parse( baseObject, context.options );

	assert.isUndefined( root.parent );
	assert.isArray( root.children );
	assert.lengthOf( root.children, 2 );
	assert.deepEqual( root.model, {
		id:   1,
		deps: [
			{
				id:   12,
				deps: [
					{ id: 122, stable: 1 },
					{ id: 122, stable: 2 },
					{ id: 121, stable: 1 },
					{ id: 121, stable: 2 },
					{ id: 121, stable: 3 },
					{ id: 121, stable: 4 },
					{ id: 121, stable: 5 },
					{ id: 121, stable: 6 },
					{ id: 121, stable: 7 },
					{ id: 121, stable: 8 },
					{ id: 121, stable: 9 },
					{ id: 121, stable: 10 },
					{ id: 121, stable: 11 },
					{ id: 121, stable: 12 },
					{ id: 121, stable: 13 },
					{ id: 121, stable: 14 },
					{ id: 121, stable: 15 },
				],
			},
			{
				id:   11,
				deps: [ { id: 111 } ],
			},
		],
	} );

	assert.deepEqual( root, root.children[0].parent );
	assert.deepEqual( root, root.children[1].parent );

	const node12 = root.children[0];
	assert.isArray( node12.children );
	assert.lengthOf( node12.children, 17 );
	assert.deepEqual( node12.model, {
		id:   12,
		deps: [
			{ id: 122, stable: 1 },
			{ id: 122, stable: 2 },
			{ id: 121, stable: 1 },
			{ id: 121, stable: 2 },
			{ id: 121, stable: 3 },
			{ id: 121, stable: 4 },
			{ id: 121, stable: 5 },
			{ id: 121, stable: 6 },
			{ id: 121, stable: 7 },
			{ id: 121, stable: 8 },
			{ id: 121, stable: 9 },
			{ id: 121, stable: 10 },
			{ id: 121, stable: 11 },
			{ id: 121, stable: 12 },
			{ id: 121, stable: 13 },
			{ id: 121, stable: 14 },
			{ id: 121, stable: 15 },
		],
	} );

	for ( let i = 0; i < 17; i++ )
		assert.deepEqual( node12, node12.children[i].parent );
} );


customConfig_parse.run();