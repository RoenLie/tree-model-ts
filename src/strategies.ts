import type { Fn } from './helpers';
import { Node } from './Node';


const depthFirstPreOrder = (
	node: Node, callback: Fn,
): void | boolean => {
	let keepGoing = callback( node );
	for ( let i = 0, childCount = node.children.length; i < childCount; i++ ) {
		if ( keepGoing === false )
			return false;

		keepGoing = depthFirstPreOrder( node.children[i], callback );
	}

	return keepGoing;
};

const depthFirstPostOrder = (
	node: Node, callback: Fn,
): void | boolean => {
	let keepGoing;

	for ( let i = 0, childCount = node.children.length; i < childCount; i++ ) {
		keepGoing = depthFirstPostOrder( node.children[ i ], callback );
		if ( keepGoing === false )
			return false;
	}

	keepGoing = callback( node );

	return keepGoing;
};

const breadthFirst = (
	node: Node, callback: Fn,
): void => {
	const queue = [ node ];

	const processQueue = () => {
		if ( queue.length === 0 )
			return;

		const node = queue.shift();
		for ( let i = 0, childCount = node!.children.length; i < childCount; i++ )
			queue.push( node!.children[ i ] );

		if ( callback( node! ) !== false )
			processQueue();
	};

	processQueue();
};

export type Strategy<T> = {[Property in keyof T]: T[Property];}
type StrategiesBase = {
	pre: typeof depthFirstPreOrder
	post: typeof depthFirstPostOrder;
	breadth: typeof breadthFirst;
}

export const walkStrategies: Strategy<StrategiesBase> = {
	pre:     depthFirstPreOrder,
	post:    depthFirstPostOrder,
	breadth: breadthFirst,
};