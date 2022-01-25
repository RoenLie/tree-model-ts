import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


const defaultConfig_all = suite( 'all(), with default configuration', { root: undefined as Node<any> } );

defaultConfig_all.before.each( ( context ) => {
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
} );

defaultConfig_all( 'should get an empty array if no nodes match the predicate', ( { root } ) => {
	const idLt0 = root.all( ( node ) => {
		return node.model.id < 0;
	} );
	assert.lengthOf( idLt0, 0 );
} );

defaultConfig_all( 'should get all nodes if no predicate is given', ( { root } ) => {
	const allNodes = root.all();
	assert.lengthOf( allNodes, 6 );
} );

defaultConfig_all( 'should get an array with the node itself if only the node matches the predicate', ( { root } ) => {
	const idEq1 = root.all( idEq( 1 ) );
	assert.lengthOf( idEq1, 1 );
	assert.deepEqual( idEq1[0], root );
} );

defaultConfig_all( 'should get an array with all nodes that match a given predicate', ( { root } ) => {
	const idGt100 = root.all( ( node ) => {
		return node.model.id > 100;
	} );
	assert.lengthOf( idGt100, 3 );
	assert.strictEqual( idGt100[0].model.id, 111 );
	assert.strictEqual( idGt100[1].model.id, 121 );
	assert.strictEqual( idGt100[2].model.id, 122 );
} );

defaultConfig_all( 'should get an array with all nodes that match a given predicate (2)', ( { root } ) => {
	const idGt10AndChildOfRoot = root.all( ( node ) => {
		return node.model.id > 10 && node.parent === root;
	} );
	assert.lengthOf( idGt10AndChildOfRoot, 2 );
	assert.strictEqual( idGt10AndChildOfRoot[0].model.id, 11 );
	assert.strictEqual( idGt10AndChildOfRoot[1].model.id, 12 );
} );

defaultConfig_all.run();