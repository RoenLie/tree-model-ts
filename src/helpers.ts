import { Node } from './Node';
import { walkStrategies } from './strategies';
import { Model } from './TreeModel';


export const hasSortFunction = ( node: Node ) => {
	return toString.call( node.config.modelSortFn ) == '[object Function]';
};


/**
 * Find the index to insert an element in array without changing the sort order.
 */
export const findInsertIndex = (
	comparatorFn: ( item: any, el: any ) => number,
	arr: any[],
	el: any,
) => {
	let i, len;
	for ( i = 0, len = arr.length; i < len; i++ )
		if ( comparatorFn( arr[ i ], el ) > 0 )
			break;

	return i;
};


export type NodeOptions = { strategy: 'pre' | 'post' | 'breadth'; };
export type Fn<TModel extends {[key: string]: any} = Model<any>> = ( node: Node<TModel> ) => boolean;
export type NullableFn<TModel extends {[key: string]: any}> = ( ( node: Node<TModel> ) => boolean ) | null;
export const parseOptions = ( _options?: NodeOptions ) => {
	const defaultOptions: NodeOptions = { strategy: 'pre' };

	const options = {
		...defaultOptions,
		..._options,
	} as NodeOptions;

	if ( !walkStrategies[ options.strategy ] )
		throw new Error( 'Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.' );

	return options;
};
