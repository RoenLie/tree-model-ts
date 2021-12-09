import { mergeSort } from './merge-sort';
import { Node } from './Node';
import { addChildToNode } from './helpers';

type Config = {
	childrenPropertyName: string;
	modelComparatorFn?: ( a: Model, b: Model ) => number;
}

export type Model = { [childrenPropName: string]: Model[] | any; id: any }


export class TreeModel {

	constructor( public config: Config ) {
		config?.childrenPropertyName || ( config.childrenPropertyName = 'children' );
	}

	public parse( model: Model ) {
		if ( !( toString.call( model ) == '[object Object]' ) )
			throw new TypeError( 'Model must be of type object.' );

		const node = new Node( this.config, model );
		if ( !Array.isArray( model[ this.config.childrenPropertyName ] ) )
			return node;

		this.config.modelComparatorFn &&
			( model[ this.config.childrenPropertyName ] = mergeSort(
				this.config.modelComparatorFn, model[ this.config.childrenPropertyName ],
			) );

		for ( let i = 0, childCount = model[ this.config.childrenPropertyName ].length; i < childCount; i++ )
			addChildToNode( node, this.parse( model[ this.config.childrenPropertyName ][ i ] ) );

		return node;
	}

}