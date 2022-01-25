import {
	NullableFn, parseOptions,
	hasSortFunction, NodeOptions, findInsertIndex,
} from './helpers';
import { walkStrategies } from './strategies';
import { ModelConfig, Model } from './TreeModel';


export class Node<T extends Record<string, any> = Model> {

	public parent: Node<T> | undefined = undefined;
	public children: Node<T>[] = [];

	constructor(
		public model: Model<T>,
		public config: ModelConfig<T> = { childKey: 'children' },
	) {}

	public get isRoot() {
		return this.parent === undefined;
	}

	public get hasChildren() {
		return this.children.length > 0;
	}

	public addChild( child: Node<T>, insertIndex?: number ) {
		if ( !( child instanceof Node ) )
			throw new TypeError( 'Child must be of type Node.' );

		const { childKey: childrenPropertyName, modelSortFn } = this.config;

		if ( !( toString.call( this.model[ childrenPropertyName ] ) == '[object Array]' ) )
			( this as Node<any> ).model[ childrenPropertyName ] = [];

		child.parent = this;

		if ( !hasSortFunction( this ) ) {
			if ( insertIndex === undefined ) {
				this.model[ childrenPropertyName ].push( child.model );
				this.children.push( child );
			}
			else {
				if ( insertIndex < 0 || insertIndex > this.children.length )
					throw new Error( 'Invalid index.' );

				this.model[ childrenPropertyName ].splice( insertIndex, 0, child.model );
				this.children.splice( insertIndex, 0, child );
			}

			return child;
		}

		// Find the index to insert the child
		const index = findInsertIndex(
			modelSortFn!,
			this.model[ childrenPropertyName ],
			child.model,
		);

		// Add to the model children
		this.model[ childrenPropertyName ].splice( index, 0, child.model );

		// Add to the node children
		this.children.splice( index, 0, child );

		return child;
	}

	public addChildAtIndex( child: Node<T>, index: number ) {
		if ( hasSortFunction( this ) )
			throw new Error( 'Cannot add child at index when using a comparator function.' );

		return this.addChild( child, index );
	}

	public getIndex() {
		if ( !this.parent )
			return 0;

		return this.parent?.children.indexOf( this );
	}

	public setIndex( index: number ) {
		if ( hasSortFunction( this ) )
			throw new Error( 'Cannot set node index when using a comparator function.' );

		if ( !this.parent ) {
			if ( index === 0 )
				return this;

			throw new Error( 'Invalid index.' );
		}

		const { childKey: childrenPropertyName } = this.parent.config;
		const { children, model } = this.parent;

		if ( index < 0 || index >= children.length )
			throw new Error( 'Invalid index.' );

		const oldIndex = children.indexOf( this );
		children.splice( index, 0, children.splice( oldIndex, 1 )[ 0 ] );
		model[ childrenPropertyName ]
			.splice( index, 0, model[ childrenPropertyName ].splice( oldIndex, 1 )[ 0 ] );

		return this;
	}

	public getPath() {
		const path: Node<T>[] = [];

		( {
			addToPath( node: Node<T> | undefined ) {
				if ( !node )
					return;

				path.unshift( node );
				node.parent && this.addToPath( node.parent );
			},
		} ).addToPath( this );

		return path;
	}

	/**
	 * Traverses through all the nodes in the tree with the given strategy.
	 *
	 * Return false to exit.
	 *
	 * .
	 */
	public walk( fn: NullableFn<T> = () => true, _options?: NodeOptions ) {
		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, fn );
	}

	/**
	 * Traverses through all the nodes in the tree with the given strategy.
	 *
	 * .
	 */
	public all( fn: NullableFn<T> = () => true, _options?: NodeOptions ) {
		const all: Node<T>[] = [];
		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, ( node ) => {
			if ( fn?.( node ) )
				all.push( node );
		} );

		return all;
	}

	/**
	 * Traverses through all the nodes in the tree with the given strategy.
	 *
	 * Returns the first node where function returns a truthy value.
	 *
	 * .
	 */
	public first( fn: NullableFn<T> = () => true, _options?: NodeOptions ) {
		let first: Node<T> | undefined = undefined;

		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, ( node ) => {
			if ( fn?.( node ) ) {
				first = node;

				return false;
			}
		} );

		return first as Node<T> | undefined;
	}

	public drop() {
		if ( !this.parent )
			return this;

		const { children, model } = this.parent;

		const indexOfChild = children.indexOf( this ) || 0;
		children.splice( indexOfChild, 1 );
		model[ this.config.childKey ].splice( indexOfChild, 1 );
		this.parent = undefined;
		delete this.parent;

		return this;
	}

}