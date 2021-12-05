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