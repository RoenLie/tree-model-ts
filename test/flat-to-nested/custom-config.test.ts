import { FlatToNested } from '../../src/FlatToNested';
import { suite } from 'uvu';
import { assert } from 'chai';


const customConfig = suite( 'using custom configuration', {
	options: {
		idKey:     'code',
		parentKey: 'from',
		childKey:  'to',
	},
} );


customConfig( 'should convert an empty array to an empty object', ( context ) => {
	assert.deepEqual( FlatToNested.convert( [], context.options ), {} );
} );

customConfig( 'should convert a one element array to an object without children', ( ) => {
	assert.deepEqual( FlatToNested.convert( [ { code: 1, someKey: 'someValue' } ] ), { code: 1, someKey: 'someValue' } );
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

	const actual = FlatToNested.convert( flat, context.options );

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

	assert.deepEqual( FlatToNested.convert( flat, context.options ), expected );
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

	assert.deepEqual( FlatToNested.convert( flat, context.options ), expected );
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

	assert.deepEqual( FlatToNested.convert( flat, context.options ), expected );
} );

customConfig.run();