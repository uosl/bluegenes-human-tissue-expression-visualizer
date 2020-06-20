import React, { useEffect, useState } from 'react';
import Heatmap from './components/Heatmap';
import { queryData, illuminaDataQuery } from './queries';
import FilterPanel from './components/FilterPanel';

const RootContainer = ({ serviceUrl, entity }) => {
	const [illuminaData, setIlluminaData] = useState([]);
	const [illuminaLoading, setIlluminaLoading] = useState(false);
	const [illuminaTissueExpressionList, setIlluminaList] = useState([]);
	const [illuminaTissueList, setIlluminaTissueList] = useState([]);
	const [illuminaTissueCount, setIlluminaTissueCount] = useState(0);
	const [filterTissue, setFilter] = useState({});
	const [newHeatmap, setNewHeatmap] = useState([]);
	const [newTissue, setNewTissue] = useState([]);

	useEffect(() => {
		setIlluminaLoading(true);
		let { value } = entity;

		queryData({
			query: illuminaDataQuery,
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setIlluminaData(data);
			setIlluminaLoading(false);
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
		setNewHeatmap(heatmapData);

		setIlluminaTissueCount(tissueData.length);

		setIlluminaTissueList(tissueData);
		setNewTissue(tissueData);

		initMapFromTissue(tissueData, true);
	}, [illuminaData]);

	const initMapFromTissue = (tissueData, checkedValue = true) => {
		let tissueMap = {};
		tissueData.forEach(p => (tissueMap = { ...tissueMap, [p]: checkedValue }));
		setFilter(tissueMap);
	};

	const updateFilters = ev => {
		const { value, checked } = ev.target;

		setFilter({
			...filterTissue,
			[value]: checked
		});
		setIlluminaTissueCount(count => (checked ? count + 1 : count - 1));
	};

	const filterGraph = () => {};

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
									<Heatmap tissueList={newTissue} graphData={newHeatmap} />
									<FilterPanel
										selectedTissue={filterTissue}
										checkedCount={illuminaTissueCount}
										updateFilters={updateFilters}
										filterGraph={filterGraph}
									/>
								</>
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
