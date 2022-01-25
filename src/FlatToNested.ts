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


type ConvertConfig = {
	idKey?: string;
	parentKey?: string;
	childKey?: string;
	options?: {
		deleteParent: boolean;
	};
}

export class FlatToNested {

	private static setConfig( config: ConvertConfig ) {
		const defaultConfig: Required<ConvertConfig> = {
			idKey:     'id',
			parentKey: 'parent',
			childKey:  'children',
			options:   { deleteParent: true },
		};

		return { ...defaultConfig, ...config };
	}

	public static convert<T extends Record<string, any>>( flat: any[], _config: ConvertConfig = {} ) {
		const config = this.setConfig( _config );

		const roots: T[] = [];
		const temp: Record<string, any> = {};
		const pendingChildOf: Record<string, any> = {};

		for ( let i = 0, len = flat.length; i < len; i++ ) {
			const flatEl = flat[i];
			const id = flatEl[config.idKey];
			const parent = flatEl[config.parentKey];

			temp[id] = flatEl;

			if ( parent === undefined || parent === null )
			// Current object has no parent, so it's a root element.
				roots.push( flatEl );
			else {
				if ( temp[parent] !== undefined )
				// Parent is already in temp, adding the current object to its children array.
					initPush( config.childKey, temp[parent], flatEl );
				else
				// Parent for this object is not yet in temp, adding it to pendingChildOf.
					initPush( parent, pendingChildOf, flatEl );

				if ( config.options.deleteParent )
					delete flatEl[config.parentKey];
			}

			if ( pendingChildOf[id] !== undefined )
			// Current object has children pending for it. Adding these to the object.
				multiInitPush( config.childKey, flatEl, pendingChildOf[id] );
		}

		const nested: Record<string, any> =
			roots.length === 1 ? roots[0]
				: roots.length > 1 ? { [config.childKey]: roots }
					: {};


		return nested as T;
	}

}