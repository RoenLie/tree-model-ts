import { findInsertIndex } from './find-insert-index';
import { Node } from './Node';
import { walkStrategies } from './strategies';


export function addChildToNode<I extends string, C extends string>(
	node: Node<I, C>, child: Node<I, C>,
) {
	child.parent = node;
	node.children.push( child );

	return child;
}

export function hasComparatorFunction<I extends string, C extends string>( node: Node<I, C> ) {
	return toString.call( node.config.modelComparatorFn ) == '[object Function]';
}

export function addChild<I extends string, C extends string>(
	self: Node<I, C>, child: Node<I, C>, insertIndex?: number,
): Node<I, C> {
	let index;

	if ( !( child instanceof Node ) )
		throw new TypeError( 'Child must be of type Node.' );


	child.parent = self;
	if ( !( toString.call( self.model[ self.config.childrenPropertyName ] ) == '[object Array]' ) )
		( self.model as any )[ self.config.childrenPropertyName ] = [];


	if ( hasComparatorFunction( self ) ) {
		// Find the index to insert the child
		index = findInsertIndex(
			self.config.modelComparatorFn!,
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


export type NodeOptions = { strategy: 'pre' | 'post' | 'breadth'; };
export type Fn<I extends string, C extends string> = ( node: Node<I, C> ) => boolean;
export type NullableFn<I extends string, C extends string> = ( ( node: Node<I, C> ) => boolean ) | null;
export function parseOptions( _options?: NodeOptions ) {
	const defaultOptions: NodeOptions = { strategy: 'pre' };

	const options = {
		...defaultOptions,
		..._options,
	} as NodeOptions;

	if ( !walkStrategies[ options.strategy ] )
		throw new Error( 'Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.' );

	return options;
}
