import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { spy } from 'sinon';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


function callback121( node: Node ) {
	if ( node.model.id === 121 )
		return false;
}
function callback12( node: Node ) {
	if ( node.model.id === 12 )
		return false;
}

const traversal = suite( 'traversal', {
	root:   undefined as Node<any>,
	spy121: spy( callback121 ),
	spy12:  spy( callback12 ),
	callback121,
	callback12,
} );

traversal.before.each( ( context ) => {
	context.root = TreeModel.parse( {
		id:       1,
		children: [
			{
				id:       11,
				children: [ { id: 111 } ],
			},
			{
				id:       12,
				children: [ { id: 121 }, { id: 122 } ],
			},
		],
	} );

	context.spy121 = spy( context.callback121 );
	context.spy12 = spy( context.callback12 );
} );


traversal( 'walk depthFirstPreOrder by default\n' +
'should traverse the nodes until the callback returns false', ( { root, spy121 } ) => {
	root.walk( spy121 );
	assert.strictEqual( spy121.callCount, 5 );

	assert( spy121.getCall( 0 ).calledWithExactly( root.first( idEq( 1 ) ) ) );
	assert( spy121.getCall( 1 ).calledWithExactly( root.first( idEq( 11 ) ) ) );
	assert( spy121.getCall( 2 ).calledWithExactly( root.first( idEq( 111 ) ) ) );
	assert( spy121.getCall( 3 ).calledWithExactly( root.first( idEq( 12 ) ) ) );
	assert( spy121.getCall( 4 ).calledWithExactly( root.first( idEq( 121 ) ) ) );
} );

traversal( 'walk depthFirstPostOrder\n' +
'should traverse the nodes until the callback returns false', ( { root, spy121 } ) => {
	root.walk( spy121, { strategy: 'post' } );
	assert.strictEqual( spy121.callCount, 3 );

	assert( spy121.getCall( 0 ).calledWithExactly( root.first( idEq( 111 ) ) ) );
	assert( spy121.getCall( 1 ).calledWithExactly( root.first( idEq( 11 ) ) ) );
	assert( spy121.getCall( 2 ).calledWithExactly( root.first( idEq( 121 ) ) ) );
} );

traversal( 'walk depthFirstPostOrder (2)\n' +
'should traverse the nodes until the callback returns false', ( { root, spy12 } ) => {
	root.walk( spy12, { strategy: 'post' } );
	assert.strictEqual( spy12.callCount, 5 );

	assert( spy12.getCall( 0 ).calledWithExactly( root.first( idEq( 111 ) ) ) );
	assert( spy12.getCall( 1 ).calledWithExactly( root.first( idEq( 11 ) ) ) );
	assert( spy12.getCall( 2 ).calledWithExactly( root.first( idEq( 121 ) ) ) );
	assert( spy12.getCall( 3 ).calledWithExactly( root.first( idEq( 122 ) ) ) );
	assert( spy12.getCall( 4 ).calledWithExactly( root.first( idEq( 12 ) ) ) );
} );

traversal( 'walk breadthFirst\n' +
'should traverse the nodes until the callback returns false', ( { root, spy121 } ) => {
	root.walk( spy121, { strategy: 'breadth' } );
	assert.strictEqual( spy121.callCount, 5 );

	assert( spy121.getCall( 0 ).calledWithExactly( root.first( idEq( 1 ) ) ) );
	assert( spy121.getCall( 1 ).calledWithExactly( root.first( idEq( 11 ) ) ) );
	assert( spy121.getCall( 2 ).calledWithExactly( root.first( idEq( 12 ) ) ) );
	assert( spy121.getCall( 3 ).calledWithExactly( root.first( idEq( 111 ) ) ) );
	assert( spy121.getCall( 4 ).calledWithExactly( root.first( idEq( 121 ) ) ) );
} );

traversal( 'walk using unknown strategy\n' +
'should throw an error warning about the strategy', ( { root, callback121 } ) => {
	assert.throws(
		root.walk.bind( root, callback121, { strategy: 'unknownStrategy' } ),
		Error,
		'Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.',
	);
} );

traversal.run();