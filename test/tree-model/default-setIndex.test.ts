import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import type { Node } from '../../src/Node';


const defaultConfig_setIndex = suite( 'setIndex(), with default configuration', { root: undefined as Node<any> } );

defaultConfig_setIndex.before.each( ( context ) => {
	context.root = TreeModel.parse( { id: 1, children: [ { id: 11 }, { id: 12 }, { id: 13 } ] } );
} );


defaultConfig_setIndex( 'should set the index of the node among its siblings', ( context ) => {
	const child = context.root.children[0];
	for ( let i = 0; i < context.root.children.length; i++ ) {
		child.setIndex( i );
		assert.equal( child.getIndex(), i );
		assert.equal( context.root.model[child.config.childKey].indexOf( child.model ), i );
	}
} );


defaultConfig_setIndex( 'keeps the order of all other nodes', ( context ) => {
	const child = context.root.children[0];
	for ( let i = 0; i < context.root.children.length; i++ ) {
		const oldOrder = [];
		for ( let j = 0; j < context.root.children.length; j++ )
			if ( context.root.children[j] !== child )
				oldOrder.push( context.root.children[j] );

		child.setIndex( i );
		for ( let k = 0; k < context.root.children.length; k++ )
			for ( let l = 0; l < context.root.children.length; l++ )
				if ( context.root.children[k] !== child && context.root.children[l] !== child )
					assert.equal( k < l, oldOrder.indexOf( context.root.children[k] ) < oldOrder.indexOf( context.root.children[l] ) );
	}
} );


defaultConfig_setIndex( 'should return itself', ( context ) => {
	const child = context.root.children[0];
	assert.equal( child.setIndex( 1 ), child );
} );


defaultConfig_setIndex( 'should throw an error when node is a root and the index is not zero', ( context ) => {
	assert.throws( () => {
		context.root.setIndex( 1 );
	}, Error, 'Invalid index.' );
} );


defaultConfig_setIndex( 'should allow to set the root node index to zero', ( context ) => {
	assert.strictEqual( context.root.setIndex( 0 ), context.root );
} );


defaultConfig_setIndex( 'should throw an error when setting to a negative index', ( context ) => {
	assert.throws( () => {
		context.root.children[0].setIndex( -1 );
	}, Error, 'Invalid index.' );
} );


defaultConfig_setIndex( 'should throw an error when setting to a too high index', ( context ) => {
	assert.throws( () => {
		context.root.children[0].setIndex( context.root.children.length );
	}, Error, 'Invalid index.' );
} );


defaultConfig_setIndex.run();