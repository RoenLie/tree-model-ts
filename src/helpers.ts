import { findInsertIndex } from './find-insert-index';
import { Node } from './Node';
import { walkStrategies } from './strategies';


export function addChildToNode( node: Node, child: Node ) {
	child.parent = node;
	node.children.push( child );

	return child;
}

export function hasComparatorFunction( node: Node ) {
	return typeof node.config.modelComparatorFn === 'function';
}

export function addChild( self: Node, child: Node, insertIndex?: number ) {
	let index;

	if ( !( child instanceof Node ) )
		throw new TypeError( 'Child must be of type Node.' );


	child.parent = self;
	if ( !( self.model[ self.config.childrenPropertyName ] instanceof Array ) )
		self.model[ self.config.childrenPropertyName ] = [];


	if ( hasComparatorFunction( self ) ) {
		// Find the index to insert the child
		index = findInsertIndex(
			self.config.modelComparatorFn,
			self.model[ self.config.childrenPropertyName ],
			child.model,
		);

		// Add to the model children
		self.model[ self.config.childrenPropertyName ].splice( index, 0, child.model );

		// Add to the node children
		self.children.splice( index, 0, child );
	}
	else
	if ( insertIndex === undefined ) {
		self.model[ self.config.childrenPropertyName ].push( child.model );
		self.children.push( child );
	}
	else {
		if ( insertIndex < 0 || insertIndex > self.children.length )
			throw new Error( 'Invalid index.' );

		self.model[ self.config.childrenPropertyName ].splice( insertIndex, 0, child.model );
		self.children.splice( insertIndex, 0, child );
	}


	return child;
}


export type ParsedArgs = {
	ctx: Node;
	fn: ( node: Node ) => boolean;
	options: {
		strategy: 'pre' | 'post' | 'breadth';
	};
}

/**
 * Parse the arguments of traversal functions. These functions can take one optional
 * first argument which is an options object. If present, this object will be stored
 * in args.options. The only mandatory argument is the callback function which can
 * appear in the first or second position (if an options object is given). This
 * function will be saved to args.fn. The last optional argument is the context on
 * which the callback function will be called. It will be available in args.ctx.
 */
export function parseArgs( ...args: any[] ) {
	const pArgs: ParsedArgs = {
		ctx:     undefined as any,
		fn:      () => true,
		options: { strategy: 'pre' },
	};

	if ( args.length === 1 )
		if ( typeof args[0] === 'function' )
			pArgs.fn = args[0];
		else
			pArgs.options = args[0];


	if ( args.length === 2 )
		if ( typeof args[ 0 ] === 'function' ) {
			pArgs.fn = args[ 0 ];
			pArgs.ctx = args[ 1 ];
		}
		else {
			pArgs.options = args[ 0 ];
			pArgs.fn = args[ 1 ];
		}


	if ( args.length !== 1 && args.length !== 2 ) {
		args?.[0] && ( pArgs.options = args[ 0 ] );
		args?.[ 1 ] && ( pArgs.fn = args[ 1 ] );
		args?.[ 2 ] && ( pArgs.ctx = args[ 2 ] );
	}


	if ( !walkStrategies[ pArgs.options.strategy ] )
		throw new Error( 'Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.' );


	return pArgs;
}
