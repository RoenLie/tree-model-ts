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


export type IncArgs = {
	ctx?: Node;
	options?: {
		strategy: 'pre' | 'post' | 'breadth';
	};
}
export type ParsedArgs = {
	ctx: Node;
	options: {
		strategy: 'pre' | 'post' | 'breadth';
	};
}
export type Fn = ( node: Node ) => boolean;
export type NullableFn = ( ( node: Node ) => boolean ) | null;

export function parseArgs( fn: NullableFn, _args?: IncArgs ) {
	const defaultArgs: ParsedArgs = {
		ctx:     undefined as any,
		options: { strategy: 'pre' },
	};

	const args = {
		...defaultArgs,
		..._args,
		fn,
	} as ParsedArgs;

	if ( !walkStrategies[ args.options.strategy ] )
		throw new Error( 'Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.' );

	return args;
}
