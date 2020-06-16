import React, { useEffect, useState } from 'react';
import { queryData } from './query';
import Heatmap from './components/Heatmap';

const RootContainer = ({ serviceUrl, entity }) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tissueExpressionList, setList] = useState([]);
	const [tissueList, setTissueList] = useState([]);

	useEffect(() => {
		setLoading(true);
		let { value } = entity;
		queryData({
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setData(data);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		const heatmapData = [];
		const tissueData = [];
		data.forEach(d => {
			const obj = {};
			obj[d.class] = d.symbol;
			d.atlasExpression.forEach(a => {
				if (tissueData.indexOf(a.condition) === -1)
					tissueData.push(a.condition);
				obj[a.condition] = a.expression * 1;
			});
			heatmapData.push(obj);
		});
		setList(heatmapData);
		setTissueList(tissueData);
	}, [data]);

	return (
		<div className="rootContainer">
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div className="innerContainer">
					<div className="graph">
						<span className="chart-title">Gene Tissue Network</span>
						{data.length ? (
							<Heatmap
								tissueList={tissueList}
								graphData={tissueExpressionList}
							/>
						) : (
							<h2>Data Not Found!</h2>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default RootContainer;
