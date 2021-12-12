import { Node } from './Node';


export type Config<TModel> = {
	childrenPropertyName: string;
	modelSortFn?: ( a: Model<TModel>, b: Model<TModel> ) => number;
}
export type Model<T> = {[P in keyof T]: T[P]} & {[key: string]: any};
export type DefaultModel = {id: string | number; children?: DefaultModel[]};


export class TreeModel<TModel extends Model<any> = DefaultModel> {

	constructor( public config: Config<TModel> = { childrenPropertyName: 'children' } ) {
		config?.childrenPropertyName ?? ( config.childrenPropertyName = 'children' );
	}

	public parse( model: Model<TModel> ) {
		const { childrenPropertyName } = this.config;

		if ( !( toString.call( model ) == '[object Object]' ) )
			throw new TypeError( 'Model must be of type object.' );

		const node = new Node<TModel>( model, this.config );
		if ( !Array.isArray( model[ childrenPropertyName ] ) )
			return node;

		if ( this.config.modelSortFn )
			( model as any )[ childrenPropertyName] = model[ childrenPropertyName ]
				.sort( this.config.modelSortFn );

		for ( let i = 0, childCount = model[ childrenPropertyName ].length; i < childCount; i++ )
			this.addChildToNode( node, this.parse( model[ childrenPropertyName ][ i ] ) );

		return node;
	}

	private addChildToNode = ( node: Node, child: Node ) => {
		child.parent = node;
		node.children.push( child );

		return child;
	};


}