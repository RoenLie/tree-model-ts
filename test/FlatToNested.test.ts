import { FlatToNested } from '../src/FlatToNested';
import { suite } from 'uvu';
import { assert } from 'chai';


const defaultConfig = suite( 'using default configuration', { flatToNested: new FlatToNested() } );

defaultConfig.before.each( ( context ) => {
	context.flatToNested = new FlatToNested();
} );

defaultConfig( 'should convert an empty array to an empty object', ( context ) => {
	assert.deepEqual( context.flatToNested.convert( [] ), {} );
} );

defaultConfig( 'should convert a one element array to an object without children', ( context ) => {
	assert.deepEqual( context.flatToNested.convert( [ { id: 1, someKey: 'someValue' } ] ), { id: 1, someKey: 'someValue' } );
} );

defaultConfig( 'should convert when the parents come before the children and there is a root', ( context ) => {
	const flat = [
		{ id: 1 },
		{ id: 11, parent: 1 },
		{ id: 12, parent: 1 },
		{ id: 111, parent: 11 },
	];

	const expected = {
		id:       1,
		children: [
			{
				id:       11,
				children: [ { id: 111 } ],
			},
			{ id: 12 },
		],
	};

	const actual = context.flatToNested.convert( flat );

	assert.deepEqual( actual, expected );
} );

defaultConfig( 'should convert when the parents come after the children and there is a root', ( context ) => {
	const flat = [
		{ id: 111, parent: 11 },
		{ id: 11, parent: 1 },
		{ id: 12, parent: 1 },
		{ id: 1 },
	];

	const expected = {
		id:       1,
		children: [
			{
				id:       11,
				children: [ { id: 111 } ],
			},
			{ id: 12 },
		],
	};

	assert.deepEqual( context.flatToNested.convert( flat ), expected );
} );

defaultConfig( 'should convert when the parents come before the children and there is no root', ( context ) => {
	const flat = [
		{ id: 1 },
		{ id: 11, parent: 1 },
		{ id: 12, parent: 1 },
		{ id: 111, parent: 11 },
		{ id: 2 },
		{ id: 21, parent: 2 },
	];

	const expected = {
		children: [
			{
				id:       1,
				children: [
					{ id: 11, children: [ { id: 111 } ] },
					{ id: 12 },
				],
			},
			{
				id:       2,
				children: [ { id: 21 } ],
			},
		],
	};

	const actual = context.flatToNested.convert( flat );

	assert.deepEqual( actual, expected );
} );

defaultConfig( 'should convert when the parents come after the children and there is no root', ( context ) => {
	const flat = [
		{ id: 111, parent: 11 },
		{ id: 11, parent: 1 },
		{ id: 12, parent: 1 },
		{ id: 1 },
		{ id: 21, parent: 2 },
		{ id: 2 },
	];

	const expected = {
		children: [
			{
				id:       1,
				children: [
					{ id: 11, children: [ { id: 111 } ] },
					{ id: 12 },
				],
			},
			{
				id:       2,
				children: [ { id: 21 } ],
			},
		],
	};

	assert.deepEqual( context.flatToNested.convert( flat ), expected );
} );

defaultConfig.run();

/* --------------------------------------------------- */

const customConfig = suite( 'using custom configuration', { flatToNested: new FlatToNested() } );

customConfig.before.each( ( context ) => {
	context.flatToNested = new FlatToNested( {
		id:       'code',
		parent:   'from',
		children: 'to',
	} );
} );

customConfig( 'should convert an empty array to an empty object', ( context ) => {
	assert.deepEqual( context.flatToNested.convert( [] ), {} );
} );

customConfig( 'should convert a one element array to an object without children', ( context ) => {
	assert.deepEqual( context.flatToNested.convert( [ { code: 1, someKey: 'someValue' } ] ), { code: 1, someKey: 'someValue' } );
} );

customConfig( 'should convert when the parents come before the children and there is a root', ( context ) => {
	const flat = [
		{ code: 1 },
		{ code: 11, from: 1 },
		{ code: 12, from: 1 },
		{ code: 111, from: 11 },
	];

	const expected = {
		code: 1,
		to:   [
			{
				code: 11,
				to:   [ { code: 111 } ],
			},
			{ code: 12 },
		],
	};

	const actual = context.flatToNested.convert( flat );

	assert.deepEqual( actual, expected );
} );

customConfig( 'should convert when the parents come after the children and there is a root', ( context ) => {
	const flat = [
		{ code: 111, from: 11 },
		{ code: 11, from: 1 },
		{ code: 12, from: 1 },
		{ code: 1 },
	];

	const expected = {
		code: 1,
		to:   [
			{
				code: 11,
				to:   [ { code: 111 } ],
			},
			{ code: 12 },
		],
	};

	assert.deepEqual( context.flatToNested.convert( flat ), expected );
} );

customConfig( 'should convert when the parents come before the children and there is no root', ( context ) => {
	const flat = [
		{ code: 1 },
		{ code: 11, from: 1 },
		{ code: 12, from: 1 },
		{ code: 111, from: 11 },
		{ code: 2 },
		{ code: 21, from: 2 },
	];

	const expected = {
		to: [
			{
				code: 1,
				to:   [
					{ code: 11, to: [ { code: 111 } ] },
					{ code: 12 },
				],
			},
			{
				code: 2,
				to:   [ { code: 21 } ],
			},
		],
	};

	const actual = context.flatToNested.convert( flat );

	assert.deepEqual( actual, expected );
} );

customConfig( 'should convert when the parents come after the children and there is no root', ( context ) => {
	const flat = [
		{ code: 111, from: 11 },
		{ code: 11, from: 1 },
		{ code: 12, from: 1 },
		{ code: 1 },
		{ code: 21, from: 2 },
		{ code: 2 },
	];

	const expected = {
		to: [
			{
				code: 1,
				to:   [
					{ code: 11, to: [ { code: 111 } ] },
					{ code: 12 },
				],
			},
			{
				code: 2,
				to:   [ { code: 21 } ],
			},
		],
	};

	assert.deepEqual( context.flatToNested.convert( flat ), expected );
} );

customConfig.run();

/* --------------------------------------------------- */

const keepParentConfig = suite( 'using options to not delete the parent', { flatToNested: new FlatToNested() } );

keepParentConfig.before.each( ( context ) => {
	context.flatToNested = new FlatToNested( { options: { deleteParent: false } } );
} );

keepParentConfig( 'should have parent after convert',
	( context ) => {
		const flat = [
			{ id: 1 },
			{ id: 2, parent: 1 },
		];

		const expected = {
			id:       1,
			children: [ { id: 2, parent: 1 } ],
		};

		const actual = context.flatToNested.convert( flat );
		assert.deepEqual( actual, expected );
	} );

keepParentConfig.run();
