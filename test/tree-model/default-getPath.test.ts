import { TreeModel } from '../../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import { idEq } from './helpers';
import type { Node } from '../../src/Node';


const defaultConfig_getPath = suite( 'getPath(), with default configuration', { root: undefined as Node<any> } );

defaultConfig_getPath.before.each( ( context ) => {
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


defaultConfig_getPath( 'should get an array with the root node if called on the root node', ( context ) => {
	const pathToRoot = context.root.getPath();
	assert.lengthOf( pathToRoot, 1 );
	assert.strictEqual( pathToRoot[0].model.id, 1 );
} );


defaultConfig_getPath( 'should get an array of nodes from the root to the node (included)', ( context ) => {
	const pathToNode121 = context.root.first( idEq( 121 ) ).getPath();
	assert.lengthOf( pathToNode121, 3 );
	assert.strictEqual( pathToNode121[0].model.id, 1 );
	assert.strictEqual( pathToNode121[1].model.id, 12 );
	assert.strictEqual( pathToNode121[2].model.id, 121 );
} );


defaultConfig_getPath.run();