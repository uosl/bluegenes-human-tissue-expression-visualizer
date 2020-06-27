import React, { useEffect, useState } from 'react';
import Heatmap from './components/Heatmap';
import { queryData, illuminaDataQuery } from './queries';
import FilterPanel from './components/FilterPanel';

const RootContainer = ({ serviceUrl, entity }) => {
	const [illuminaData, setIlluminaData] = useState([]);
	const [illuminaLoading, setIlluminaLoading] = useState(false);
	const [illuminaHeatmapData, setIlluminaHeatmapData] = useState([]);
	const [illuminaTissueList, setIlluminaTissueList] = useState([]);
	const [heatmapTissueList, setHeatmapTissueList] = useState([]);
	const [illuminaFilterHeatmap, setIlluminaFilterHeatmap] = useState([]);
	const [selectedTissue, setSelectedTissue] = useState([]);
	const [selectedExpression, setSelectedExpression] = useState('Low');

	// const [gTexData, setGTexData] = useState([]);
	// const [gTexLoading, setGTexLoading] = useState(false);
	// const [gTexTissueExpressionList, setGTexList] = useState([]);
	// const [gTexTissueList, setGTexTissueList] = useState([]);
	// const [gTexTissueCount, setGTexTissueCount] = useState(0);
	// const [filterGTexTissue, setGTexFilter] = useState({});
	// const [newGTexHeatmap, setNewGTexHeatmap] = useState([]);
	// const [newGTexTissue, setNewGTexTissue] = useState([]);

	useEffect(() => {
		setIlluminaLoading(true);
		// setGTexLoading(true);
		let { value } = entity;
		queryData({
			query: illuminaDataQuery,
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setIlluminaData(data);
			setIlluminaLoading(false);
		});
		// .then(() => {
		// 	queryData({
		// 		query: gTexDataQuery,
		// 		serviceUrl: serviceUrl,
		// 		geneId: !Array.isArray(value) ? [value] : value
		// 	}).then(data => {
		// 		setGTexData(data);
		// 		localStorage.setItem('gtex', JSON.stringify(data));

		// 		setGTexLoading(false);
		// 	});
		// });
	}, []);

	useEffect(() => {
		const heatmapData = [];
		const tissueList = [];
		illuminaData.forEach(data => {
			const graphObj = {};
			graphObj[data.class] = data.symbol;
			data.atlasExpression.forEach(tissue => {
				const { condition, expression } = tissue;
				if (tissueList.filter(t => t.value == condition).length == 0)
					tissueList.push({ label: condition, value: condition });
				graphObj[condition] = expression * 1;
			});
			heatmapData.push(graphObj);
		});

		setIlluminaTissueList(tissueList);
		setHeatmapTissueList(tissueList);
		setIlluminaHeatmapData(heatmapData);
		setIlluminaFilterHeatmap(heatmapData);
	}, [illuminaData]);

	// useEffect(() => {
	// 	console.log(illuminaFilterHeatmap);
	// 	const low = [], medium = [], high = [];
	// 	illuminaFilterHeatmap.forEach(tissue => {
	// 		const obj = {};
	// 		Object.keys(tissue).map((item) => {
	// 			if(tissue[item] <= 10 || item == 'Gene') obj[item] = tissue[item];
	// 		});
	// 		low.push(obj);
	// 	});
	// 	console.log(low);
	// 	setIlluminaHeatmapData(low);
	// }, [illuminaFilterHeatmap]);

	// useEffect(() => {
	// 	const heatmapData = [];
	// 	const tissueList = [];
	// 	gTexData.forEach(d => {
	// 		const obj = {};
	// 		obj[d.class] = d.symbol;
	// 		d.rnaSeqResults.forEach(a => {
	// 			if (tissueList.indexOf(a.tissue) === -1) tissueList.push(a.tissue);
	// 			obj[a.tissue] = a.expressionScore * 1;
	// 		});
	// 		heatmapData.push(obj);
	// 	});
	// 	setGTexList(heatmapData);
	// 	setNewGTexHeatmap(heatmapData);

	// 	setGTexTissueCount(tissueList.length);

	// 	setGTexTissueList(tissueList);
	// 	setNewGTexTissue(tissueList);

	// 	// initMapFromTissue(tissueData, true, 2);
	// }, [gTexData]);

	const updateFilter = value => {
		setSelectedTissue(value);
	};

	const filterGraph = () => {
		const tempGraphData = [];

		illuminaFilterHeatmap.forEach(data => {
			const graphObj = {};
			graphObj['Gene'] = data.Gene;
			Object.keys(data).map(item => {
				if (selectedTissue.filter(tissue => tissue.value == item).length > 0) {
					graphObj[item] = data[item];
				}
			});
			tempGraphData.push(graphObj);
		});
		setHeatmapTissueList([...selectedTissue]);
		setIlluminaHeatmapData(tempGraphData);
	};

	return (
		<div className="rootContainer">
			<div className="innerContainer">
				<div className="graph">
					{illuminaLoading ? (
						<h1>Loading...</h1>
					) : (
						<>
							<span className="chart-title">
								Gene Tissue Expression (illumina Body Map)
							</span>
							{illuminaData.length ? (
								<>
									<Heatmap
										tissueList={heatmapTissueList}
										graphData={illuminaHeatmapData}
										labelHeight={100}
										graphHeight={illuminaData.length * 100 + 100}
									/>
									<FilterPanel
										tissueList={illuminaTissueList}
										filterGraph={filterGraph}
										updateFilter={updateFilter}
										selectedExpression={selectedExpression}
										applyFilter={e => setSelectedExpression(e.target.value)}
									/>
								</>
							) : (
								<h2>Data Not Found!</h2>
							)}
						</>
					)}
					{/* {gTexLoading ? (
						<h1>Loading...</h1>
					) : (
						<>
							<span className="chart-title">Gene Tissue Expression (GTex)</span>
							{gTexData.length ? (
								<>
									<Heatmap
										tissueList={newGTexTissue}
										graphData={newGTexHeatmap}
										labelHeight={200}
										graphHeight={gTexData.length * 100 + 200}
									/>
									<FilterPanel
										selectedTissue={filterGTexTissue}
										checkedCount={gTexTissueCount}
										updateFilters={updateGTexFilters}
										filterGraph={filterGTexGraph}
									/>
								</>
							) : (
								<h2>Data Not Found!</h2>
							)}
						</>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default RootContainer;
