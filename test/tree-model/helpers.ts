import type { Node } from '../../src/Node';

export function idEq( id: string | number ) {
	return function( node: Node<any> ) {
		return node.model.id === id;
	};
}