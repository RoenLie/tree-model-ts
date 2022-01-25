import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


const defaultConfig_addChild = suite( 'addChild(), with default configuration', { root: undefined as Node<any> } );

defaultConfig_addChild.before.each( ( context ) => {
	context.root = TreeModel.parse( { id: 1, children: [ { id: 11 }, { id: 12 } ] } );
} );


defaultConfig_addChild( 'should add child to the end', ( context ) => {
	context.root.addChild( TreeModel.parse( { id: 13 } ) );
	context.root.addChild( TreeModel.parse( { id: 10 } ) );
	assert.deepEqual( context.root.model.children, [ { id: 11 }, { id: 12 }, { id: 13 }, { id: 10 } ] );
} );


defaultConfig_addChild( 'should throw an error when child is not a Node', ( context ) => {
	assert.throws( context.root.addChild.bind( context.root, { children: [] } ), TypeError, 'Child must be of type Node.' );
} );


defaultConfig_addChild( 'should add child at index', ( context ) => {
	context.root.addChildAtIndex( TreeModel.parse( { id: 13 } ), 1 );
	assert.deepEqual( context.root.model.children, [ { id: 11 }, { id: 13 }, { id: 12 } ] );
	assert.equal( context.root.children[1].model.id, 13 );
} );


defaultConfig_addChild( 'should add child at the end when index matches the children number', ( context ) => {
	context.root.addChildAtIndex( TreeModel.parse( { id: 13 } ), 2 );
	assert.deepEqual( context.root.model.children, [ { id: 11 }, { id: 12 }, { id: 13 } ] );
} );


defaultConfig_addChild( 'should add child at index 0 of a leaf', ( context ) => {
	const leaf = context.root.first( idEq( 11 ) );
	leaf.addChildAtIndex( TreeModel.parse( { id: 111 } ), 0 );
	assert.deepEqual( leaf.model.children, [ { id: 111 } ] );
} );


defaultConfig_addChild( 'should throw an error when adding child at negative index', ( context ) => {
	const child = TreeModel.parse( { id: 13 } );
	assert.throws( context.root.addChildAtIndex.bind( context.root, child, -1 ), Error, 'Invalid index.' );
} );


defaultConfig_addChild( 'should throw an error when adding child at a too high index', ( context ) => {
	const child = TreeModel.parse( { id: 13 } );
	assert.throws( context.root.addChildAtIndex.bind( context.root, child, 3 ), Error, 'Invalid index.' );
} );


defaultConfig_addChild.run();