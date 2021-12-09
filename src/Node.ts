import {
	IncArgs, NullableFn, parseArgs,
	ParsedArgs, addChild, hasComparatorFunction,
} from './helpers';
import { walkStrategies } from './strategies';
import { Model } from './TreeModel';


export class Node {

	public parent: Node | undefined = undefined;
	public children: any[] = [];
	constructor( public config: any, public model: Model ) {
	}

	public isRoot() {
		return this.parent === undefined;
	}

	public hasChildren() {
		return this.children.length > 0;
	}

	public addChild( child: Node ) {
		return addChild( this, child );
	}

	public addChildAtIndex( child: Node, index: number ) {
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

		this.parent!.children.splice( index, 0, this.parent!.children.splice( oldIndex, 1 )[ 0 ] );

		this.parent!.model[ this.parent!.config.childrenPropertyName ]
			.splice( index, 0, this.parent!.model[ this.parent!.config.childrenPropertyName ].splice( oldIndex, 1 )[ 0 ] );

		return this;
	}

	public getPath() {
		const path = [];
		( function addToPath( node ) {
			path.unshift( node );
			if ( !node.isRoot() )
				addToPath( node.parent as any );
		} )( this );

		return path;
	}

	public getIndex() {
		if ( this.isRoot() )
			return 0;

		return this.parent!.children.indexOf( this );
	}

	public walk( fn: NullableFn = () => true, _args?: IncArgs ) {
		const args: ParsedArgs = parseArgs( fn, _args );
		fn = fn || ( () => true );

		walkStrategies[ args.options.strategy ].call( this, fn!, args.ctx );
	}

	public all( fn: NullableFn = () => true, _args?: IncArgs ) {
		const all: Node[] = [];
		const args: ParsedArgs = parseArgs( fn, _args );
		fn = fn || ( () => true );

		walkStrategies[ args.options.strategy ].call( this, ( node: Node ) => {
			if ( fn?.call( args.ctx, node ) )
				all.push( node );

			return true;
		}, args.ctx );

		return all;
	}

	public first( fn: NullableFn = () => true, _args?: IncArgs ) {
		let first: Node | undefined = undefined;

		const args: ParsedArgs = parseArgs( fn, _args );
		fn = fn || ( () => true );

		walkStrategies[ args.options.strategy ].call( this, ( node: Node ) => {
			if ( fn?.call( args.ctx, node ) ) {
				first = node;

				return false;
			}

			return true;
		}, args.ctx );

		return first as Node | undefined;
	}

	public drop() {
		if ( !this.isRoot() ) {
			const indexOfChild = this?.parent?.children.indexOf( this ) || 0;
			this?.parent?.children.splice( indexOfChild, 1 );
			this?.parent?.model[ this.config.childrenPropertyName ].splice( indexOfChild, 1 );
			this.parent = undefined;
			delete this.parent;
		}

		return this;
	}

}