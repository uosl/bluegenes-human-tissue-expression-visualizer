const illuminaDataQuery = geneId => ({
	constraintLogic: 'A and B',
	from: 'Gene',
	select: [
		'atlasExpression.dataSets.name',
		'symbol',
		'atlasExpression.condition',
		'atlasExpression.expression',
		'atlasExpression.type'
	],
	orderBy: [
		{
			path: 'atlasExpression.condition',
			direction: 'ASC'
		}
	],
	where: [
		{
			path: 'atlasExpression.dataSets.name',
			op: '=',
			value: 'E-MTAB-513',
			code: 'A'
		},
		{
			path: 'Gene.id',
			op: 'ONE OF',
			values: geneId,
			extraValue: '',
			code: 'B'
		}
	]
});

const gTexDataQuery = geneId => ({
	from: 'Gene',
	select: [
		'primaryIdentifier',
		'symbol',
		'rnaSeqResults.tissue',
		'rnaSeqResults.expressionScore',
		'rnaSeqResults.dataSets.name'
	],
	orderBy: [
		{
			path: 'rnaSeqResults.tissue',
			direction: 'ASC'
		}
	],
	where: [
		{
			path: 'Gene.id',
			op: 'ONE OF',
			values: geneId,
			extraValue: 'H. sapiens',
			code: 'A'
		}
	]
});

const RNASeqQuery = geneId => ({
	constraintLogic: 'A and B',
	from: 'Gene',
	select: [
		'primaryIdentifier',
		'symbol',
		'rnaSeqResults.tissue',
		'rnaSeqResults.expressionScore',
		'rnaSeqResults.dataSets.name'
	],
	orderBy: [
		{
			path: 'rnaSeqResults.tissue',
			direction: 'ASC'
		}
	],
	where: [
		{
			path: 'Gene.rnaSeqResults.dataSets.name',
			code: 'B',
			op: '=',
			value: 'Protein Atlas RNA Gene data'
		},
		{
			path: 'Gene.id',
			code: 'A',
			op: 'ONE OF',
			values: geneId,
			extraValue: 'H. sapiens'
		}
	]
});

const queryData = ({ query, geneId, serviceUrl, imjsClient = imjs }) => {
	const service = new imjsClient.Service({
		root: serviceUrl
	});
	return new Promise((resolve, reject) => {
		service
			.records(query(geneId))
			.then(res => {
				if (res.length === 0) reject('No data found!');
				resolve(res);
			})
			.catch(() => reject('No data found!'));
	});
};

export { queryData, illuminaDataQuery, gTexDataQuery, RNASeqQuery };
