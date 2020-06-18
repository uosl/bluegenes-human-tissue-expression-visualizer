import React, { useEffect, useState } from 'react';
import Heatmap from './components/Heatmap';
import { queryData, illuminaDataQuery, gTexDataQuery } from './queries';

const RootContainer = ({ serviceUrl, entity }) => {
	const [illuminaData, setIlluminaData] = useState([]);
	const [gTexData, setGTexData] = useState([]);
	const [illuminaLoading, setIlluminaLoading] = useState(false);
	const [gTexLoading, setGTexLoading] = useState(false);
	const [illuminaTissueExpressionList, setIlluminaList] = useState([]);
	const [illuminaTissueList, setIlluminaTissueList] = useState([]);
	const [gTexTissueExpressionList, setGTexList] = useState([]);
	const [gTexTissueList, setGTexTissueList] = useState([]);

	useEffect(() => {
		setIlluminaLoading(true);
		setGTexLoading(true);
		let { value } = entity;

		queryData({
			query: illuminaDataQuery,
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setIlluminaData(data);
			setIlluminaLoading(false);
		});

		queryData({
			query: gTexDataQuery,
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setGTexData(data);
			setGTexLoading(false);
		});
	}, []);

	useEffect(() => {
		const heatmapData = [];
		const tissueData = [];
		illuminaData.forEach(d => {
			const obj = {};
			obj[d.class] = d.symbol;
			d.atlasExpression.forEach(a => {
				if (tissueData.indexOf(a.condition) === -1)
					tissueData.push(a.condition);
				obj[a.condition] = a.expression * 1;
			});
			heatmapData.push(obj);
		});
		setIlluminaList(heatmapData);
		setIlluminaTissueList(tissueData);
	}, [illuminaData]);

	useEffect(() => {
		const heatmapData = [];
		const tissueData = [];
		gTexData.forEach(d => {
			const obj = {};
			obj[d.class] = d.symbol;
			d.rnaSeqResults.forEach(a => {
				if (tissueData.indexOf(a.tissue) === -1) tissueData.push(a.tissue);
				obj[a.tissue] = a.expressionScore * 1;
			});
			heatmapData.push(obj);
		});
		setGTexList(heatmapData);
		setGTexTissueList(tissueData);
	}, [gTexData]);

	return (
		<div className="rootContainer">
			<div className="innerContainer">
				<div className="graph">
					<span className="chart-title">Gene Tissue Network</span>
					{illuminaLoading ? (
						<h1>Loading...</h1>
					) : (
						<>
							{illuminaData.length ? (
								<Heatmap
									tissueList={illuminaTissueList}
									graphData={illuminaTissueExpressionList}
									width={500}
								/>
							) : (
								<h2>Data Not Found!</h2>
							)}
						</>
					)}
					{gTexLoading ? (
						<h1>Loading...</h1>
					) : (
						<>
							{gTexData.length ? (
								<Heatmap
									tissueList={gTexTissueList}
									graphData={gTexTissueExpressionList}
									width={4000}
								/>
							) : (
								<h2>Data Not Found!</h2>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RootContainer;
