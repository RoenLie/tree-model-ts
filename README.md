# TreeModel
Manipulate and traverse tree-like structures in javascript.<br>
This is an ESM and updated version of the original project named: tree-model made by **João Nuno Silva**
## <br>API Reference
### <hr><br>Creating a default TreeModel
```ts
const treeModel = new TreeModel();
```
### <hr><br>Parse the hierarchy object
Parse the given user defined model and return the root Node object.<br>
The default model is for child nodes to be present under the `children` property.<br>
If your hierarchy structure is different, see the next section on how to create a custom TreeModel.
```ts
const model = {
	id: 1,
	children: [ { id: 11 } ]
}

const treeModel = new TreeModel();
const root = treeModel.parse( model );
```
### <hr><br> Create a custom TreeModel
In order to get proper type completion when using a custom model you must first create either an interface or a type that represents the structure that you wish to have available whenever a node is presented.<br>
You must also set the `childrenPropertyName` option in the class constructor so that the nodes know which property to search for internally.
```ts
interface Company {
	code: string;
	companies?: Company[];
}

const companyHierarchy: Company = {
	code: 1,
	companies: [ { code: 11 } ]
}

const companyTree = new TreeModel<Company>( { childrenPropertyName: 'companies' } );
const root = companyTree.parse( companyHierarchy );
```
### <hr><br> Sorting child nodes
You may provide a custom sort function for how the child nodes will be inserted into the parent nodes.
```ts
interface DefaultModel = {
	id: string;
	children: DefaultModel[];
}

const model: DefaultModel = {
	id: 1,
	children: [ { id: 11 } ]
}

const modelSortFn = ( a: DefaultModel, b: DefaultModel ) =>
	Number( b.id ) - Number( a.id );

const tree = new TreeModel<DefaultModel>( {
	childrenPropertyName: 'children',
	modelSortFn
} );
const root = tree.parse(model);
```
### <hr><br>Is Root?
Return `true` if this Node is the root, `false` otherwise.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

root.isRoot(); // boolean
```
### <hr><br>Has Children?
Return `true` if this Node has one or more children, `false` otherwise.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

root.hasChildren(); // Node[]
```
### <hr><br>Add a child
Add the given node as child of this one. Return the child Node.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

const newNode = new Node( { id: 2: children: [ { id: 22 } ] } );

root.addChild(newNode); // Node
```

### <hr><br>Add a child at a given index
Add the given node as child of this one at the given index. Return the child Node.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

const index = 0;

root.addChildAtIndex(childNode, index); // Node
```
### <hr><br>Set the index of a node among its siblings
Sets the index of the node among its siblings to the given value. Return the node itself.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

const index = 0;

const node = root.first( node => node.id == 11 );
node.setIndex(index); // Node
```
### <hr><br>Get the index of a node among its siblings
Gets the index of the node relative to its siblings. Return the index value.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

const node = root.first( node => node.id == 11 );
node.getIndex(); // number
```
### <hr><br>Get the node path
Get the array of Nodes representing the path from the root to this Node (inclusive).

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

const node = root.first( node => node.id == 11 );
node.getPath(); // Node[]
```
### <hr><br>Delete a node from the tree
Drop the subtree starting at this node. Returns the node itself, which is now a root node.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

const node = root.first( node => node.id == 11 );
node.drop(); // Node
```

*Warning* - Dropping a node while walking the tree is not supported.<br>
You must first collect the nodes to drop using one of the traversal functions and then drop them.<br>

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

root.all( node => node.id ).forEach( node => {
	node.drop();
} )
```
### <hr><br>Find a node
Starting from this node, find the first Node that matches the predicate and return it. The **predicate** is a function wich receives the visited Node and returns `true` if the Node should be picked and `false` otherwise.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

root.first( node => node.id == 11 ); // Node
```
### <hr><br>Find all nodes
Starting from this node, find all Nodes that match the predicate and return these.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

root.all( node => node.id ); // Node[]
```
### <hr><br>Walk the tree
Starting from this node, traverse the subtree calling the action for each visited node.<br>
The action is a function which receives the visited Node as argument.<br>
The traversal can be halted by returning `false` from the action.

```ts
const model = { id: 1, children: [ { id: 11 } ] };
const tree = new TreeModel();
const root = tree.parse(model);

root.walk( node => console.log( node ), { strategy: 'post' });
```

**Note** - `first`, `all` and `walk` can all accept an option object that defines which traversal strategy to use.
* `{strategy: 'pre'}` - Depth-first pre-order *[default]*.
* `{strategy: 'post'}` - Depth-first post-order.
* `{strategy: 'breadth'}` - Breadth-first.


# <hr><br>FlatToNested
Manipulate and traverse tree-like structures in javascript.

Convert a hierarchy from flat to nested representation.
## Example

```ts
const flatToNested = new FlatToNested( /* can take a config object to use other property names */ );

const flat = [
	{ id: 1 }
	{ parent: 1,  id: 11  },
	{ parent: 11, id: 111 },
	{ parent: 1,  id: 12  },
	{ parent: 12, id: 121 },
];

const nested = flatToNested.convert( flat );
console.log( nested );

//	{
//		id: 1,
//		children: [
//			{
//				id: 11,
//				children: [ { id: 111 } ]
//			},
//			{
//				id: 12,
//				children: [ { id: 121 } ]
//			}
//		]
//	}
```

## Configuration

The constructor accepts an optional object with some or all of these properties:

```js
flatToNested = new FlatToNested( {
	// The name of the property with the node id in the flat representation.
	id: 'id',
	// The name of the property with the parent node id in the flat representation.
	parent: 'parent',
	// The name of the property that will hold the children nodes in the nested representation.
	children: 'children',
	// Deletes the parent wrapper.
	options: { deleteParent: true }
} );
```

## <hr><br>Contributing

### Setup
`yarn install`

### Code Linting
`yarn lint`

### Running Tests
`yarn test`