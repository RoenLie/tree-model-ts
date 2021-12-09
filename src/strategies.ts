import type { Fn } from './helpers';
import { Node } from './Node';


function depthFirstPreOrder(
	this: Node, callback: Fn, context: Node,
): boolean {
	//console.log( callback );

	let keepGoing = callback.call( context, this );
	for ( let i = 0, childCount = this.children.length; i < childCount; i++ ) {
		if ( keepGoing === false )
			return false;

		keepGoing = depthFirstPreOrder.call( this.children[i], callback, context );
	}

	return keepGoing;
}

function depthFirstPostOrder(
	this: Node, callback: Fn, context: Node,
): boolean {
	let keepGoing;

	for ( let i = 0, childCount = this.children.length; i < childCount; i++ ) {
		keepGoing = depthFirstPostOrder.call( this.children[ i ], callback, context );
		if ( keepGoing === false )
			return false;
	}

	keepGoing = callback.call( context, this );

	return keepGoing;
}

function breadthFirst(
	this: Node, callback: Fn, context: Node,
): any {
	const queue = [ this ];
	( function processQueue() {
		if ( queue.length === 0 )
			return;

		const node = queue.shift();
		for ( let i = 0, childCount = node!.children.length; i < childCount; i++ )
			queue.push( node!.children[ i ] );

		if ( callback.call( context, node! ) !== false )
			processQueue();
	} )();
}

export type Strategy<T> = {[Property in keyof T]: T[Property];}
type StrategiesBase = {
	pre: ( this: Node, callback: Fn, context: Node ) => boolean;
	post: ( this: Node, callback: Fn, context: Node ) => boolean;
	breadth: ( this: Node, callback: Fn, context: Node ) => any;
}

export const walkStrategies: Strategy<StrategiesBase> = {
	pre:     depthFirstPreOrder,
	post:    depthFirstPostOrder,
	breadth: breadthFirst,
};