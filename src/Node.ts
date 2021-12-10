import {
	NullableFn, parseOptions,
	addChild, hasComparatorFunction, NodeOptions,
} from './helpers';
import { walkStrategies } from './strategies';
import { Config, Model } from './TreeModel';


export class Node<I extends string = `id`, C extends string = `id`> {

	public parent: Node<I, C> | undefined = undefined;
	public children: any[] = [];
	constructor( public config: Config<I, C>, public model: Model<I, C> ) {}

	public isRoot() {
		return this.parent === undefined;
	}

	public hasChildren() {
		return this.children.length > 0;
	}

	public addChild( child: Node<I, C> ) {
		return addChild( this, child );
	}

	public addChildAtIndex( child: Node<I, C>, index: number ) {
		if ( hasComparatorFunction( this ) )
			throw new Error( 'Cannot add child at index when using a comparator function.' );

		return addChild( this, child, index );
	}

	public setIndex( index: number ) {
		if ( hasComparatorFunction( this ) )
			throw new Error( 'Cannot set node index when using a comparator function.' );

		if ( this.isRoot() ) {
			if ( index === 0 )
				return this;

			throw new Error( 'Invalid index.' );
		}

		if ( index < 0 || index >= this.parent!.children.length )
			throw new Error( 'Invalid index.' );

		const oldIndex = this.parent!.children.indexOf( this );

		this.parent?.children.splice( index, 0, this.parent!.children.splice( oldIndex, 1 )[ 0 ] );

		this.parent?.model[ this.parent.config.childrenPropertyName ]
			.splice( index, 0, this.parent!.model[ this.parent!.config.childrenPropertyName ].splice( oldIndex, 1 )[ 0 ] );

		return this;
	}

	public getPath() {
		const path: Node<I, C>[] = [];

		const addToPath = ( node: Node<I, C> | undefined ) => {
			if ( !node )
				throw new Error( 'Attempting to add invalid node to path' );

			path.unshift( node );
			if ( !node.isRoot() )
				addToPath( node.parent );
		};
		addToPath( this );

		return path;
	}

	public getIndex() {
		if ( this.isRoot() )
			return 0;

		return this.parent?.children.indexOf( this );
	}

	public walk( fn: NullableFn<I, C> = () => true, _options?: NodeOptions ) {
		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, fn! );
	}

	public all( fn: NullableFn<I, C> = () => true, _options?: NodeOptions ) {
		const all: Node<I, C>[] = [];
		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, ( node: Node<I, C> ) => {
			if ( fn?.( node ) )
				all.push( node );

			return true;
		} );

		return all;
	}

	public first( fn: NullableFn<I, C> = () => true, _options?: NodeOptions ) {
		let first: Node<I, C> | undefined = undefined;

		const options: NodeOptions = parseOptions( _options );
		fn = fn || ( () => true );

		walkStrategies[ options.strategy ]( this, ( node: Node<I, C> ) => {
			if ( fn?.( node ) ) {
				first = node;

				return false;
			}

			return true;
		} );

		return first as Node<I, C> | undefined;
	}

	public drop() {
		if ( this.isRoot() )
			return this;

		const indexOfChild = this?.parent?.children.indexOf( this ) || 0;
		this?.parent?.children.splice( indexOfChild, 1 );
		this?.parent?.model[ this.config.childrenPropertyName ].splice( indexOfChild, 1 );
		this.parent = undefined;
		delete this.parent;

		return this;
	}

}