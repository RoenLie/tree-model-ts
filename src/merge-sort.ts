/**
	 * Sort an array using the merge sort algorithm.
*/
export function mergeSort( comparatorFn: ( a: any, b: any ) => number, arr: any ): any {
	const len = arr.length;
	let firstHalf, secondHalf;
	if ( len >= 2 ) {
		firstHalf = arr.slice( 0, len / 2 );
		secondHalf = arr.slice( len / 2, len );

		return merge(
			comparatorFn,
			mergeSort( comparatorFn, firstHalf ),
			mergeSort( comparatorFn, secondHalf ),
		);
	}
	else
		return arr.slice();
}


/**
	 * The merge part of the merge sort algorithm.
*/
export const merge = ( comparatorFn: ( a: any, b: any ) => number, arr1: any, arr2: any ) => {
	const result = [];

	let left1 = arr1.length;
	let left2 = arr2.length;
	while ( left1 > 0 && left2 > 0 )
		if ( comparatorFn( arr1[0], arr2[0] ) <= 0 ) {
			result.push( arr1.shift() );
			left1--;
		}
		else {
			result.push( arr2.shift() );
			left2--;
		}

	if ( left1 > 0 )
		result.push( ...arr1 );
	else
		result.push( ...arr2 );

	return result;
};