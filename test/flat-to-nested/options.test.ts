import { FlatToNested } from '../../src/FlatToNested';
import { suite } from 'uvu';
import { assert } from 'chai';


const keepParentConfig = suite( 'using options to not delete the parent' );

keepParentConfig( 'should have parent after convert', () => {
	const flat = [
		{ id: 1 },
		{ id: 2, parent: 1 },
	];

	const expected = {
		id:       1,
		children: [ { id: 2, parent: 1 } ],
	};

	const actual = FlatToNested.convert( flat, { options: { deleteParent: false } } );
	assert.deepEqual( actual, expected );
} );

keepParentConfig.run();