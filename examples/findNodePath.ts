import { FlatToNested } from '../src/FlatToNested';
import { TreeModel } from '../src/TreeModel';


interface Company extends Record<string, any>{
	id: string;
	companies: Company[];
}


const companiesFlat = [
	{ id: '1' },
	{ parent: '1', id: '1_1' },
	{ parent: '1_1', id: '1_1_1' },
	{ parent: '1', id: '1_2' },
	{ parent: '1_2', id: '1_2_1' },
	{ parent: '1', id: '1_3' },
	{ parent: '1_3', id: '1_3_1' },
	{ parent: '1_3_1', id: '1_3_1_1' },
	{ parent: '1_3_1_1', id: '1_3_1_1_1' },
];


const companies = FlatToNested.convert<Company>( companiesFlat, { childKey: 'companies' } );
const root = TreeModel.parse( companies, { childKey: 'companies' } );
const deepChild = root.first( ( node ) => !!( node.model.id == '1_3_1_1_1' ) );

deepChild?.getPath().forEach( node => {
	console.log( node.model.id );
} );