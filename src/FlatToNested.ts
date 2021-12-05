function initPush( arrayName: string, obj: Record<string, any>, toPush: any ) {
	if ( obj[arrayName] === undefined )
		obj[arrayName] = [];

	obj[arrayName].push( toPush );
}

function multiInitPush( arrayName: string, obj: Record<string, any>, toPushArray: any[] ) {
	let len = toPushArray.length;
	if ( obj[arrayName] === undefined )
		obj[arrayName] = [];

	while ( len-- > 0 )
		obj[arrayName].push( toPushArray.shift() );
}


export class FlatToNested {

	constructor( public config: any = {} ) {
		this.config = config = config || {};
		this.config.id = config.id || 'id';
		this.config.parent = config.parent || 'parent';
		this.config.children = config.children || 'children';
		this.config.options = config.options || { deleteParent: true };
	}

	public convert( flat: any[] ) {
		const roots: any[] = [];
		const temp: any = {};
		const pendingChildOf: any = {};

		for ( let i = 0, len = flat.length; i < len; i++ ) {
			const flatEl = flat[i];
			const id = flatEl[this.config.id];
			const parent = flatEl[this.config.parent];

			temp[id] = flatEl;

			if ( parent === undefined || parent === null )
			// Current object has no parent, so it's a root element.
				roots.push( flatEl );
			else {
				if ( temp[parent] !== undefined )
				// Parent is already in temp, adding the current object to its children array.
					initPush( this.config.children, temp[parent], flatEl );
				else
				// Parent for this object is not yet in temp, adding it to pendingChildOf.
					initPush( parent, pendingChildOf, flatEl );

				if ( this.config.options.deleteParent )
					delete flatEl[this.config.parent];
			}

			if ( pendingChildOf[id] !== undefined )
			// Current object has children pending for it. Adding these to the object.
				multiInitPush( this.config.children, flatEl, pendingChildOf[id] );
		}

		const nested: Record<string, any> =
		roots.length === 1 ? roots[0]
			: roots.length > 1 ? { [this.config.children]: roots }
				: {};


		return nested;
	}

}