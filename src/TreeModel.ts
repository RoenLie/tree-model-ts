import { mergeSort } from './merge-sort';
import { Node } from './Node';
import { addChildToNode } from './helpers';


export type Config<I extends string, C extends string> = {
	idPropertyName?: string;
	childrenPropertyName: string;
	modelComparatorFn?: ( a: Model<I, C>, b: Model<I, C> ) => number;
}


type ModelId<T extends string> = {
	[P in [T][number]]: string | number;
}
type ModelChildren<I extends string, T extends string> = {
	[P in [T][number]]: Model<I, T>[];
}
export type Model<I extends string = `id`, C extends string = `children`> =
	ModelId<I> & Partial<ModelChildren<I, C>> & { [key: string]: any };


export class TreeModel<I extends string = `id`, C extends string = `children`> {

	constructor( public config: Config<I, C> = { childrenPropertyName: 'children' } ) {}

	public parse( model: Model<I, C> ) {
		if ( !( toString.call( model ) == '[object Object]' ) )
			throw new TypeError( 'Model must be of type object.' );

		const node = new Node( this.config, model );
		if ( !Array.isArray( model[ this.config.childrenPropertyName ] ) )
			return node;

		this.config.modelComparatorFn &&
			( ( model as any )[ this.config.childrenPropertyName] = mergeSort(
				this.config.modelComparatorFn, model[ this.config.childrenPropertyName ],
			) );

		for ( let i = 0, childCount = model[ this.config.childrenPropertyName ].length; i < childCount; i++ )
			addChildToNode( node, this.parse( model[ this.config.childrenPropertyName ][ i ] ) );

		return node;
	}

}