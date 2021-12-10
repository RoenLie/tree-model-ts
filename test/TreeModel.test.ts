import { TreeModel } from '../src/TreeModel';
import { suite } from 'uvu';
import { assert } from 'chai';
import type { Node } from '../src/Node';
import { spy } from 'sinon';


function idEq( id: string | number ) {
	return function( node: Node<`id`, `children`> ) {
		return node.model.id === id;
	};
}

/* --------------------------------------------------- */

const defaultConfig_parse = suite( 'parse(), with default configuration', { treeModel: new TreeModel() } );

defaultConfig_parse.before.each( ( context ) => {
	context.treeModel = new TreeModel();
} );

defaultConfig_parse( 'should throw an error when model is a number (not an object)', ( context ) => {
	assert.throws( context.treeModel.parse.bind( context.treeModel, 1 ), TypeError, 'Model must be of type object.' );
} );

defaultConfig_parse( 'should throw an error when model is a string (not an object)', ( context ) => {
	assert.throws( context.treeModel.parse.bind( context.treeModel, 'string' ), TypeError, 'Model must be of type object.' );
} );

defaultConfig_parse( 'should throw an error when some child in the model is not an object', ( context ) => {
	assert.throws(
		context.treeModel.parse.bind( context.treeModel, { children: [ 'string' ] } ),
		TypeError,
		'Model must be of type object.',
	);
} );

defaultConfig_parse( 'should create a root node when given a model without children', ( context ) => {
	const root = context.treeModel.parse( { id: 1 } as any );

	assert.isUndefined( root.parent );
	assert.isArray( root.children );
	assert.lengthOf( root.children, 0 );
	assert.deepEqual( root.model, { id: 1 } );
} );

defaultConfig_parse( 'should create a root and the respective children when given a model with children', ( context ) => {
	const root = context.treeModel.parse( {
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

/* --------------------------------------------------- */

const defaultConfig_addChild = suite( 'addChild(), with default configuration', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1, children: [ { id: 11 }, { id: 12 } ] } ),
} );

defaultConfig_addChild.before.each( ( context ) => {
	context.root = context.treeModel.parse( { id: 1, children: [ { id: 11 }, { id: 12 } ] } );
} );

defaultConfig_addChild( 'should add child to the end', ( context ) => {
	context.root.addChild( context.treeModel.parse( { id: 13 } ) );
	context.root.addChild( context.treeModel.parse( { id: 10 } ) );
	assert.deepEqual( context.root.model.children, [ { id: 11 }, { id: 12 }, { id: 13 }, { id: 10 } ] );
} );

defaultConfig_addChild( 'should throw an error when child is not a Node', ( context ) => {
	assert.throws( context.root.addChild.bind( context.root, { children: [] } ), TypeError, 'Child must be of type Node.' );
} );

defaultConfig_addChild( 'should add child at index', ( context ) => {
	context.root.addChildAtIndex( context.treeModel.parse( { id: 13 } ), 1 );
	assert.deepEqual( context.root.model.children, [ { id: 11 }, { id: 13 }, { id: 12 } ] );
	assert.equal( context.root.children[1].model.id, 13 );
} );

defaultConfig_addChild( 'should add child at the end when index matches the children number', ( context ) => {
	context.root.addChildAtIndex( context.treeModel.parse( { id: 13 } ), 2 );
	assert.deepEqual( context.root.model.children, [ { id: 11 }, { id: 12 }, { id: 13 } ] );
} );

defaultConfig_addChild( 'should add child at index 0 of a leaf', ( context ) => {
	const leaf = context.root.first( idEq( 11 ) );
	leaf.addChildAtIndex( context.treeModel.parse( { id: 111 } ), 0 );
	assert.deepEqual( leaf.model.children, [ { id: 111 } ] );
} );

defaultConfig_addChild( 'should throw an error when adding child at negative index', ( context ) => {
	const child = context.treeModel.parse( { id: 13 } );
	assert.throws( context.root.addChildAtIndex.bind( context.root, child, -1 ), Error, 'Invalid index.' );
} );

defaultConfig_addChild( 'should throw an error when adding child at a too high index', ( context ) => {
	const child = context.treeModel.parse( { id: 13 } );
	assert.throws( context.root.addChildAtIndex.bind( context.root, child, 3 ), Error, 'Invalid index.' );
} );

defaultConfig_addChild.run();

/* --------------------------------------------------- */

const defaultConfig_setIndex = suite( 'setIndex(), with default configuration', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1, children: [ { id: 11 }, { id: 12 }, { id: 13 } ] } ),
} );

defaultConfig_setIndex.before.each( ( context ) => {
	context.root = context.treeModel.parse( { id: 1, children: [ { id: 11 }, { id: 12 }, { id: 13 } ] } );
} );

defaultConfig_setIndex( 'should set the index of the node among its siblings', ( context ) => {
	const child = context.root.children[0];
	for ( let i = 0; i < context.root.children.length; i++ ) {
		child.setIndex( i );
		assert.equal( child.getIndex(), i );
		assert.equal( context.root.model[child.config.childrenPropertyName].indexOf( child.model ), i );
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

/* --------------------------------------------------- */

const defaultConfig_getPath = suite( 'getPath(), with default configuration', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1 } ),
} );

defaultConfig_getPath.before.each( ( context ) => {
	context.root = context.treeModel.parse( {
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

/* --------------------------------------------------- */

function callback121( node: Node<`id`, `children`> ) {
	if ( node.model.id === 121 )
		return false;
}
function callback12( node: Node<`id`, `children`> ) {
	if ( node.model.id === 12 )
		return false;
}

const traversal = suite( 'traversal', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1 } ),
	spy121:    spy( callback121 ),
	spy12:     spy( callback12 ),
	callback121,
	callback12,
} );

traversal.before.each( ( context ) => {
	context.root = context.treeModel.parse( {
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

/* --------------------------------------------------- */

const defaultConfig_all = suite( 'all(), with default configuration', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1 } ),
} );

defaultConfig_all.before.each( ( context ) => {
	context.root = context.treeModel.parse( {
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

/* --------------------------------------------------- */

const defaultConfig_first = suite( 'first(), with default configuration', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1 } ),
} );

defaultConfig_first.before.each( ( context ) => {
	context.root = context.treeModel.parse( {
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

defaultConfig_first( 'should get the first node when the predicate returns true', ( { root } ) => {
	const first = root.first( () => {
		return true;
	} );
	assert.equal( first.model.id, 1 );
} );

defaultConfig_first( 'should get the first node when no predicate is given', ( { root } ) => {
	const first = root.first();
	assert.equal( first.model.id, 1 );
} );

defaultConfig_first( 'should get the first node with a different strategy when the predicate returns true', ( { root } ) => {
	const first = root.first( null, { strategy: 'post' } );
	assert.equal( first.model.id, 111 );
} );

defaultConfig_first( 'should get the first node with a different strategy when no predicate is given', ( { root } ) => {
	const first = root.first( null, { strategy: 'post' } );
	assert.equal( first.model.id, 111 );
} );

defaultConfig_first.run();


/* --------------------------------------------------- */

const defaultConfig_drop = suite( 'drop(), with default configuration', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1 } ),
} );

defaultConfig_drop.before.each( ( context ) => {
	context.root = context.treeModel.parse( {
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

defaultConfig_drop( 'should give back the dropped node, even if it is the root', ( { root } ) => {
	assert.deepEqual( root.drop(), root );
} );

defaultConfig_drop( 'should give back the dropped node, which no longer be found in the original root', ( { root } ) => {
	assert.deepEqual( root.first( idEq( 11 ) ).drop().model, { id: 11, children: [ { id: 111 } ] } );
	assert.isUndefined( root.first( idEq( 11 ) ) );
} );

defaultConfig_drop.run();

/* --------------------------------------------------- */

const defaultConfig_hasChildren = suite( 'hasChildren(), with default configuration', {
	treeModel: new TreeModel(),
	root:      new TreeModel().parse( { id: 1 } ),
} );

defaultConfig_hasChildren.before.each( ( context ) => {
	context.root = context.treeModel.parse( {
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

defaultConfig_hasChildren( 'should return true for node with children', ( { root } ) => {
	assert.equal( root.hasChildren(), true );
} );

defaultConfig_hasChildren( 'should return false for node without children', ( { root } ) => {
	assert.equal( root.first( idEq( 111 ) ).hasChildren(), false );
} );

defaultConfig_hasChildren.run();

/* --------------------------------------------------- */

const customConfig_parse = suite( 'parse(), with custom configuration', { treeModel: new TreeModel() } );

customConfig_parse.before.each( ( context ) => {
	context.treeModel = new TreeModel( {
		idPropertyName:       'id',
		childrenPropertyName: 'deps',
		modelComparatorFn:    function( a, b ) {
			return Number( b.id ) - Number( a.id );
		},
	} );
} );

customConfig_parse( 'should create a root and stable sort the respective children according to the comparator', ( { treeModel } ) => {
	const root = treeModel.parse( {
		id:   1,
		deps: [
			{
				id:   11,
				deps: [ { id: 111 } ],
			},
			{
				id:   12,
				deps: [
					{ id: 122, stable: 1 },
					{ id: 121, stable: 1 },
					{ id: 121, stable: 2 },
					{ id: 121, stable: 3 },
					{ id: 121, stable: 4 },
					{ id: 121, stable: 5 },
					{ id: 121, stable: 6 },
					{ id: 121, stable: 7 },
					{ id: 121, stable: 8 },
					{ id: 121, stable: 9 },
					{ id: 121, stable: 10 },
					{ id: 121, stable: 11 },
					{ id: 121, stable: 12 },
					{ id: 121, stable: 13 },
					{ id: 121, stable: 14 },
					{ id: 121, stable: 15 },
					{ id: 122, stable: 2 },
				],
			},
		],
	} );

	assert.isUndefined( root.parent );
	assert.isArray( root.children );
	assert.lengthOf( root.children, 2 );
	assert.deepEqual( root.model, {
		id:   1,
		deps: [
			{
				id:   12,
				deps: [
					{ id: 122, stable: 1 },
					{ id: 122, stable: 2 },
					{ id: 121, stable: 1 },
					{ id: 121, stable: 2 },
					{ id: 121, stable: 3 },
					{ id: 121, stable: 4 },
					{ id: 121, stable: 5 },
					{ id: 121, stable: 6 },
					{ id: 121, stable: 7 },
					{ id: 121, stable: 8 },
					{ id: 121, stable: 9 },
					{ id: 121, stable: 10 },
					{ id: 121, stable: 11 },
					{ id: 121, stable: 12 },
					{ id: 121, stable: 13 },
					{ id: 121, stable: 14 },
					{ id: 121, stable: 15 },
				],
			},
			{
				id:   11,
				deps: [ { id: 111 } ],
			},
		],
	} );

	assert.deepEqual( root, root.children[0].parent );
	assert.deepEqual( root, root.children[1].parent );

	const node12 = root.children[0];
	assert.isArray( node12.children );
	assert.lengthOf( node12.children, 17 );
	assert.deepEqual( node12.model, {
		id:   12,
		deps: [
			{ id: 122, stable: 1 },
			{ id: 122, stable: 2 },
			{ id: 121, stable: 1 },
			{ id: 121, stable: 2 },
			{ id: 121, stable: 3 },
			{ id: 121, stable: 4 },
			{ id: 121, stable: 5 },
			{ id: 121, stable: 6 },
			{ id: 121, stable: 7 },
			{ id: 121, stable: 8 },
			{ id: 121, stable: 9 },
			{ id: 121, stable: 10 },
			{ id: 121, stable: 11 },
			{ id: 121, stable: 12 },
			{ id: 121, stable: 13 },
			{ id: 121, stable: 14 },
			{ id: 121, stable: 15 },
		],
	} );

	for ( let i = 0; i < 17; i++ )
		assert.deepEqual( node12, node12.children[i].parent );
} );

customConfig_parse.run();

/* --------------------------------------------------- */

const customConfig_addChild = suite( 'addChild(), with custom configuration', { treeModel: new TreeModel() } );

customConfig_addChild.before.each( ( context ) => {
	context.treeModel = new TreeModel( {
		idPropertyName:       'id',
		childrenPropertyName: 'deps',
		modelComparatorFn:    function( a, b ) {
			return Number( b.id ) - Number( a.id );
		},
	} );
} );

customConfig_addChild( 'should add child respecting the given comparator', ( { treeModel } ) => {
	const root = treeModel.parse( {
		id:   1,
		deps: [
			{ id: 12, stable: 1 },
			{ id: 11, stable: 1 },
			{ id: 11, stable: 2 },
			{ id: 11, stable: 3 },
			{ id: 11, stable: 4 },
			{ id: 11, stable: 5 },
			{ id: 11, stable: 6 },
			{ id: 11, stable: 7 },
			{ id: 12, stable: 2 },
			{ id: 11, stable: 8 },
			{ id: 11, stable: 9 },
			{ id: 11, stable: 10 },
			{ id: 11, stable: 11 },
			{ id: 11, stable: 12 },
			{ id: 11, stable: 13 },
			{ id: 11, stable: 14 },
			{ id: 11, stable: 15 },
			{ id: 13, stable: 1 },
			{ id: 12, stable: 3 },
		],
	} );
	root.addChild( treeModel.parse( { id: 13, stable: 2 } ) );
	root.addChild( treeModel.parse( { id: 10, stable: 1 } ) );
	root.addChild( treeModel.parse( { id: 10, stable: 2 } ) );
	root.addChild( treeModel.parse( { id: 12, stable: 4 } ) );
	assert.lengthOf( root.children, 23 );
	assert.deepEqual( root.model.deps, [
		{ id: 13, stable: 1 },
		{ id: 13, stable: 2 },
		{ id: 12, stable: 1 },
		{ id: 12, stable: 2 },
		{ id: 12, stable: 3 },
		{ id: 12, stable: 4 },
		{ id: 11, stable: 1 },
		{ id: 11, stable: 2 },
		{ id: 11, stable: 3 },
		{ id: 11, stable: 4 },
		{ id: 11, stable: 5 },
		{ id: 11, stable: 6 },
		{ id: 11, stable: 7 },
		{ id: 11, stable: 8 },
		{ id: 11, stable: 9 },
		{ id: 11, stable: 10 },
		{ id: 11, stable: 11 },
		{ id: 11, stable: 12 },
		{ id: 11, stable: 13 },
		{ id: 11, stable: 14 },
		{ id: 11, stable: 15 },
		{ id: 10, stable: 1 },
		{ id: 10, stable: 2 },
	] );
} );

customConfig_addChild( 'should keep child nodes and model child nodes positions in sync', ( { treeModel } ) => {
	const root = treeModel.parse( { id: 1, deps: [ { id: 12 }, { id: 11 } ] } );
	root.addChild( treeModel.parse( { id: 13 } ) );
	root.addChild( treeModel.parse( { id: 10 } ) );
	assert.lengthOf( root.children, 4 );
	assert.deepEqual( root.model.deps, [ { id: 13 }, { id: 12 }, { id: 11 }, { id: 10 } ] );

	assert.equal( root.children[0].model.id, 13 );
	assert.equal( root.children[1].model.id, 12 );
	assert.equal( root.children[2].model.id, 11 );
	assert.equal( root.children[3].model.id, 10 );
} );

customConfig_addChild( 'should throw an error when adding child at index but a comparator was provided', ( { treeModel } ) => {
	const root = treeModel.parse( { id: 1, deps: [ { id: 12 }, { id: 11 } ] } );
	const child = treeModel.parse( { id: 13 } );
	assert.throws(
		root.addChildAtIndex.bind( root, child, 1 ),
		Error,
		'Cannot add child at index when using a comparator function.',
	);
} );

customConfig_addChild.run();

/* --------------------------------------------------- */

const customConfig_setIndex = suite( 'setIndex(), with custom configuration', { treeModel: new TreeModel() } );

customConfig_setIndex.before.each( ( context ) => {
	context.treeModel = new TreeModel( {
		idPropertyName:       'id',
		childrenPropertyName: 'deps',
		modelComparatorFn:    function( a, b ) {
			return Number( b.id ) - Number( a.id );
		},
	} );
} );

customConfig_setIndex( 'should throw an error when setting a node index but a comparator was provided', ( { treeModel } ) => {
	const root = treeModel.parse( { id: 1, deps: [ { id: 12 }, { id: 11 } ] } );
	const child = root.children[0];

	assert.throws(
		() => {
			child.setIndex( 0 );
		},
		Error,
		'Cannot set node index when using a comparator function.',
	);
} );

customConfig_setIndex.run();

/* --------------------------------------------------- */

const customConfig_drop = suite(
	'drop(), with custom configuration',
	{
		treeModel: new TreeModel(),
		root:      new TreeModel().parse( { id: 1 } ),
	},
);

customConfig_drop.before.each( ( context ) => {
	context.treeModel = new TreeModel( {
		idPropertyName:       'id',
		childrenPropertyName: 'deps',
		modelComparatorFn:    function( a, b ) {
			return Number( b.id ) - Number( a.id );
		},
	} );

	context.root = context.treeModel.parse( {
		id:   1,
		deps: [
			{
				id:   11,
				deps: [ { id: 111 } ],
			},
			{
				id:   12,
				deps: [ { id: 121 }, { id: 122 } ],
			},
		],
	} );
} );

customConfig_drop( 'should give back the dropped node, even if it is the root', ( { root } ) => {
	assert.deepEqual( root.drop(), root );
} );

customConfig_drop( 'should give back the dropped node, which no longer be found in the original root', ( { root } ) => {
	assert.deepEqual( root.first( idEq( 11 ) ).drop().model, { id: 11, deps: [ { id: 111 } ] } );
	assert.isUndefined( root.first( idEq( 11 ) ) );
} );

customConfig_drop.run();

/* --------------------------------------------------- */

const customConfig_hasChildren = suite( 'hasChildren(), with custom configuration', {
	treeModel: new TreeModel<`id`, `deps`>(),
	root:      new TreeModel<`id`, `deps`>().parse( { id: 1, deps: [] } ),
} );

customConfig_hasChildren.before.each( ( context ) => {
	context.treeModel = new TreeModel<`id`, `deps`>( {
		idPropertyName:       'id',
		childrenPropertyName: 'deps',
		modelComparatorFn:    function( a, b ) {
			return Number( b.id ) - Number( a.id );
		},
	} );

	context.root = context.treeModel.parse( {
		id:   1,
		deps: [
			{
				id:   11,
				deps: [ { id: 111 } ],
			},
			{
				id:   12,
				deps: [ { id: 121 }, { id: 122 } ],
			},
		],
	} );
} );

customConfig_hasChildren( 'should return true for node with children', ( { root } ) => {
	assert.equal( root.hasChildren(), true );
} );

customConfig_hasChildren( 'should return false for node without children', ( { root } ) => {
	assert.equal( root.first( idEq( 111 ) ).hasChildren(), false );
} );

customConfig_hasChildren.run();