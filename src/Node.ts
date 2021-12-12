import {
	NullableFn, parseOptions,
	hasSortFunction, NodeOptions, findInsertIndex,
} from './helpers';
import { walkStrategies } from './strategies';
import { Config, Model } from './TreeModel';


export class Node<TModel extends Model<any> = Model<any>> {

	public parent: Node<TModel> | undefined = undefined;
	public children: Node<Model<TModel>>[] = [];
	constructor(
		public model: Model<TModel>,
		public config: Config<TModel> = { childrenPropertyName: 'children' },
	) {}

	public get isRoot() {
		return this.parent === undefined;
	}

	public get hasChildren() {
		return this.children.length > 0;
	}

	public addChild( child: Node<TModel>, insertIndex?: number ) {
		if ( !( child instanceof Node ) )
			throw new TypeError( 'Child must be of type Node.' );

		const { childrenPropertyName, modelSortFn } = this.config;

		if ( !( toString.call( this.model[ childrenPropertyName ] ) == '[object Array]' ) )
			( this as Node<Model<any>> ).model[ childrenPropertyName ] = [];

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

	public addChildAtIndex( child: Node<TModel>, index: number ) {
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

		const { childrenPropertyName } = this.parent.config;
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
		const path: Node<TModel>[] = [];

		const addToPath = ( node: Node<TModel> | undefined ) => {
			if ( !node )
				return;

			path.unshift( node );
			if ( node.parent )
				addToPath( node.parent );
		};
		addToPath( this );

		return path;
	}

	public walk( fn: NullableFn<TModel> = () => true, _options?: NodeOptions ) {
		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, fn );
	}

	public all( fn: NullableFn<TModel> = () => true, _options?: NodeOptions ) {
		const all: Node<TModel>[] = [];
		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, ( node: Node<TModel> ) => {
			if ( fn?.( node ) )
				all.push( node );

			return true;
		} );

		return all;
	}

	public first( fn: NullableFn<TModel> = () => true, _options?: NodeOptions ) {
		let first: Node<TModel> | undefined = undefined;

		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, ( node: Node<TModel> ) => {
			if ( fn?.( node ) ) {
				first = node;

				return false;
			}

			return true;
		} );

		return first as Node<TModel> | undefined;
	}

	public drop() {
		if ( !this.parent )
			return this;

		const { children, model } = this.parent;

		const indexOfChild = children.indexOf( this ) || 0;
		children.splice( indexOfChild, 1 );
		model[ this.config.childrenPropertyName ].splice( indexOfChild, 1 );
		this.parent = undefined;
		delete this.parent;

		return this;
	}

}