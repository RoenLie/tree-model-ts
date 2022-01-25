import { Node } from './Node';


export type ModelConfig<T> = {
	childKey: string;
	modelSortFn?: ( a: Model<T>, b: Model<T> ) => number;
}
export type Model<T = any> = Record<string, any> & T;


export class TreeModel {

	public static parse<T extends Record<string, any>>( model: Model<T>, config: ModelConfig<T> = { childKey: 'children' } ) {
		const { childKey } = config;

		if ( !( toString.call( model ) == '[object Object]' ) )
			throw new TypeError( 'Model must be of type object.' );

		const node = new Node<T>( model, config );
		if ( !Array.isArray( model[ childKey ] ) )
			return node;

		if ( config.modelSortFn )
			( model as any )[ childKey] = model[ childKey ]
				.sort( config.modelSortFn );

		for ( let i = 0, childCount = model[ childKey ].length; i < childCount; i++ )
			TreeModel.addChildToNode( node, TreeModel.parse( model[ childKey ][ i ], config ) );

		return node;
	}

	public static parseArray<T extends Record<string, any>>( model: Model<T>[], config: ModelConfig<T> = { childKey: 'children' } ) {
		const node = TreeModel.parse<T>( { [config.childKey]: model } as any );

		return node;
	}


	private static addChildToNode = ( node: Node, child: Node ) => {
		child.parent = node;
		node.children.push( child );

		return child;
	};

}