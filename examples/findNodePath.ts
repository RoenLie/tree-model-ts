import { TreeModel } from '../src/TreeModel';

const hierarchy = {
	id:       '1',
	children: [
		{
			id:       '1_1',
			children: [
				{
					id:       '1_1_1',
					children: [],
				},
			],
		},
		{
			id:       '1_2',
			children: [
				{
					id:       '1_2_1',
					children: [],
				},
			],
		},
		{
			id:       '1_3',
			children: [
				{
					id:       '1_3_1',
					children: [
						{
							id:       '1_3_1_1',
							children: [
								{
									id:          '1_3_1_1_1',
									children:    [],
									randomProp1: 'hei',
									randomProp2: 'nei',
								},
							],
						},
					],
				},
			],
		},
	],
};


const treeModel = new TreeModel();
const root = treeModel.parse( hierarchy );

//console.dir( root, { depth: null } );

const deepChild = root.first( ( node ) =>
	!!( node.model.id == '1_3_1_1_1' ) );


console.log( 'found node', deepChild );
