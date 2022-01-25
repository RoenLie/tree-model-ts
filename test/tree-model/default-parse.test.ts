import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';


const defaultConfig_parse = suite( 'parse(), with default configuration', { treeModel: new TreeModel() } );


defaultConfig_parse( 'should throw an error when model is a number (not an object)', () => {
	assert.throws( TreeModel.parse.bind( TreeModel, 1 ), TypeError, 'Model must be of type object.' );
} );

defaultConfig_parse( 'should throw an error when model is a string (not an object)', ( ) => {
	assert.throws( TreeModel.parse.bind( TreeModel, 'string' ), TypeError, 'Model must be of type object.' );
} );

defaultConfig_parse( 'should throw an error when some child in the model is not an object', ( ) => {
	assert.throws( TreeModel.parse.bind( TreeModel, { children: [ 'string' ] } ), TypeError, 'Model must be of type object.' );
} );

defaultConfig_parse( 'should create a root node when given a model without children', ( ) => {
	const root = TreeModel.parse( { id: 1 } );

	assert.isUndefined( root.parent );
	assert.isArray( root.children );
	assert.lengthOf( root.children, 0 );
	assert.deepEqual( root.model, { id: 1 } );
} );

defaultConfig_parse( 'should create a root and the respective children when given a model with children', ( context ) => {
	const root = TreeModel.parse( {
		id:       1,
		children: [
			{
				id:       11,
				children: [ { id: 111 } ],
			},
			{
				id:       12,
				children: [
					{ id: 121 },
					{ id: 122 },
					{ id: 123 },
					{ id: 124 },
					{ id: 125 },
					{ id: 126 },
					{ id: 127 },
					{ id: 128 },
					{ id: 129 },
					{ id: 1210 },
					{ id: 1211 },
				],
			},
		],
	} );

	assert.isUndefined( root.parent );
	assert.isArray( root.children );
	assert.lengthOf( root.children, 2 );
	assert.deepEqual( root.model, {
		id:       1,
		children: [
			{
				id:       11,
				children: [ { id: 111 } ],
			},
			{
				id:       12,
				children: [
					{ id: 121 },
					{ id: 122 },
					{ id: 123 },
					{ id: 124 },
					{ id: 125 },
					{ id: 126 },
					{ id: 127 },
					{ id: 128 },
					{ id: 129 },
					{ id: 1210 },
					{ id: 1211 },
				],
			},
		],
	} );

	assert.deepEqual( root, root.children[0].parent );
	assert.deepEqual( root, root.children[1].parent );

	const node12 = root.children[1];
	assert.isArray( node12.children );
	assert.lengthOf( node12.children, 11 );
	assert.deepEqual( node12.model, {
		id:       12,
		children: [
			{ id: 121 },
			{ id: 122 },
			{ id: 123 },
			{ id: 124 },
			{ id: 125 },
			{ id: 126 },
			{ id: 127 },
			{ id: 128 },
			{ id: 129 },
			{ id: 1210 },
			{ id: 1211 },
		],
	} );

	assert.deepEqual( node12, node12.children[0].parent );
	assert.deepEqual( node12, node12.children[1].parent );
} );

defaultConfig_parse.run();