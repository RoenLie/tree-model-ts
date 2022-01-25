import { FlatToNested } from '../../src/FlatToNested';
import { suite } from 'uvu';
import { assert } from 'chai';


const defaultConfig = suite( 'using default configuration' );


defaultConfig( 'should convert an empty array to an empty object', () => {
	assert.deepEqual( FlatToNested.convert( [] ), {} );
} );

defaultConfig( 'should convert a one element array to an object without children', () => {
	const arr1 = [ { id: 1, someKey: 'someValue' } ];
	const obj1 = { id: 1, someKey: 'someValue' };


	assert.deepEqual( FlatToNested.convert( arr1 ), obj1 );
} );

defaultConfig( 'should convert when the parents come before the children and there is a root', () => {
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

	const actual = FlatToNested.convert( flat );

	assert.deepEqual( actual, expected );
} );

defaultConfig( 'should convert when the parents come after the children and there is a root', () => {
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

	assert.deepEqual( FlatToNested.convert( flat ), expected );
} );

defaultConfig( 'should convert when the parents come before the children and there is no root', () => {
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

	const actual = FlatToNested.convert( flat );

	assert.deepEqual( actual, expected );
} );

defaultConfig( 'should convert when the parents come after the children and there is no root', () => {
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

	assert.deepEqual( FlatToNested.convert( flat ), expected );
} );

defaultConfig( 'should support multiple roots', () => {
	const flat = [
		{ id: 1 },
		{ id: 2 },
		{ id: 11, parent: 1 },
		{ id: 22, parent: 2 },
	];

	const expected = {
		children: [
			{
				id:       1,
				children: [ { id: 11 } ],
			},
			{
				id:       2,
				children: [ { id: 22 } ],
			},
		],
	};

	assert.deepEqual( FlatToNested.convert( flat ), expected );
} );

defaultConfig.run();