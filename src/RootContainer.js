import React, { useEffect, useState } from 'react';
import Heatmap from './components/Heatmap';
import { queryData, illuminaDataQuery } from './queries';
import FilterPanel from './components/FilterPanel';

const RootContainer = ({ serviceUrl, entity }) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [dataAccToLevel, setDataAccToLevel] = useState([]);
	const [tissueList, setTissueList] = useState([]);
	const [heatmapData, setHeatmapData] = useState([]);
	const [selectedTissue, setSelectedTissue] = useState([]);
	const [selectedExpression, setSelectedExpression] = useState({});
	const expressionLevel = ['Low', 'Medium', 'High'];

	useEffect(() => {
		setLoading(true);
		let { value } = entity;
		queryData({
			query: illuminaDataQuery,
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setData(data);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		const expressionLevelData = {};
		const tissueList = [];
		// For every level iterating data received from the query and putting them
		// according to its expression level - low, medium, high. Also, filtering out
		// the tissue list that will be used passed to the filterpanel and heatmap as prop
		Object.keys(selectedExpression).map(level => {
			const curLevel = selectedExpression[level];
			if (!curLevel) return;
			const levelData = [];
			data.forEach(d => {
				const obj = {};
				obj[d.class] = d.symbol;
				d.atlasExpression.forEach(tissue => {
					const { condition, expression } = tissue;
					if (tissueList.filter(t => t.value == condition).length == 0)
						tissueList.push({ label: condition, value: condition });
					// multiplied by 1 to convert string to number and then checking its expression level
					if (checkLevel(level, expression * 1))
						obj[condition] = expression * 1;
				});
				levelData.push(obj);
			});
			expressionLevelData[level] = levelData;
		});
		setDataAccToLevel(expressionLevelData);
		setTissueList(tissueList);
		initExpressionLevel(true);
	}, [data]);

	useEffect(() => {
		// on toggle of expression level -> merge the data of those level whose value is true
		// suppose the state is - low: true, medium: true and low: [{gene: ADH5, gland: 3}], medium: [{gene: ADH5, testis: 21}]
		// formatted data after merging them - [{gene: ADH5, gland: 3, testis: 21}]
		const obj = {};
		Object.keys(selectedExpression).map(level => {
			if (dataAccToLevel[level] !== undefined && selectedExpression[level]) {
				Object.values(dataAccToLevel[level]).map(d => {
					obj[d.Gene] = { ...obj[d.Gene], ...d };
				});
			}
		});
		setHeatmapData([...Object.values(obj)]);
	}, [selectedExpression]);

	const checkLevel = (level, val) => {
		if (level == 'Low') return val <= 10;
		if (level == 'Medium') return val >= 11 && val <= 1000;
		if (level == 'High') return val > 1000;
	};

	const initExpressionLevel = (checkedValue = true) => {
		// created a map to store the state of all expression levels as checked
		let levelMap = {};
		expressionLevel.forEach(
			l => (levelMap = { ...levelMap, [l]: checkedValue })
		);
		setSelectedExpression(levelMap);
	};

	const expressionLevelFilter = e => {
		const { value, checked } = e.target;
		// simply toggle the state of expression level in its map
		setSelectedExpression({
			...selectedExpression,
			[value]: checked
		});
	};

	const filterGraph = () => {};

	return (
		<div className="rootContainer">
			<div className="innerContainer">
				<div className="graph">
					{loading ? (
						<h1>Loading...</h1>
					) : (
						<div
							style={{ width: !heatmapData.length ? 'calc(100vw - 5rem)' : '' }}
						>
							<span className="chart-title">
								Gene Tissue Expression (illumina Body Map)
							</span>
							{heatmapData.length ? (
								<Heatmap
									tissueList={tissueList}
									graphData={heatmapData}
									labelHeight={100}
									graphHeight={heatmapData.length * 100 + 100}
								/>
							) : (
								<div className="noTissue">Data Not Found!</div>
							)}
							<FilterPanel
								tissueList={tissueList}
								filterGraph={filterGraph}
								updateFilter={value => setSelectedTissue(value)}
								selectedExpression={selectedExpression}
								expressionLevelFilter={expressionLevelFilter}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RootContainer;
