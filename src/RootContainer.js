import React, { useEffect, useState } from 'react';
import Heatmap from './components/Heatmap';
import { queryData, illuminaDataQuery, gTexDataQuery } from './queries';
import FilterPanel from './components/FilterPanel';

const RootContainer = ({ serviceUrl, entity }) => {
	const [illuminaData, setIlluminaData] = useState([]);
	const [illuminaLoading, setIlluminaLoading] = useState(false);
	const [illuminaTissueExpressionList, setIlluminaList] = useState([]);
	const [illuminaTissueList, setIlluminaTissueList] = useState([]);
	const [illuminaTissueCount, setIlluminaTissueCount] = useState(0);
	const [filterIlluminaTissue, setIlluminaFilter] = useState({});
	const [newIlluminaHeatmap, setNewIlluminaHeatmap] = useState([]);
	const [newIlluminaTissue, setNewIlluminaTissue] = useState([]);

	const [gTexData, setGTexData] = useState([]);
	const [gTexLoading, setGTexLoading] = useState(false);
	const [gTexTissueExpressionList, setGTexList] = useState([]);
	const [gTexTissueList, setGTexTissueList] = useState([]);
	const [gTexTissueCount, setGTexTissueCount] = useState(0);
	const [filterGTexTissue, setGTexFilter] = useState({});
	const [newGTexHeatmap, setNewGTexHeatmap] = useState([]);
	const [newGTexTissue, setNewGTexTissue] = useState([]);

	useEffect(() => {
		setIlluminaLoading(true);
		setGTexLoading(true);
		let { value } = entity;

		queryData({
			query: illuminaDataQuery,
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		})
			.then(data => {
				setIlluminaData(data);
				setIlluminaLoading(false);
			})
			.then(() => {
				queryData({
					query: gTexDataQuery,
					serviceUrl: serviceUrl,
					geneId: !Array.isArray(value) ? [value] : value
				}).then(data => {
					setGTexData(data);
					setGTexLoading(false);
				});
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
		setNewIlluminaHeatmap(heatmapData);

		setIlluminaTissueCount(tissueData.length);

		setIlluminaTissueList(tissueData);
		setNewIlluminaTissue(tissueData);

		initMapFromTissue(tissueData, true, 1);
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
		setNewGTexHeatmap(heatmapData);

		setGTexTissueCount(tissueData.length);

		setGTexTissueList(tissueData);
		setNewGTexTissue(tissueData);

		initMapFromTissue(tissueData, true, 2);
	}, [gTexData]);

	const initMapFromTissue = (tissueData, checkedValue = true, dataType) => {
		let tissueMap = {};
		tissueData.forEach(p => (tissueMap = { ...tissueMap, [p]: checkedValue }));
		if (dataType == 1) setIlluminaFilter(tissueMap);
		if (dataType == 2) setGTexFilter(tissueMap);
	};

	const updateFilters = ev => {
		const { value, checked } = ev.target;

		setIlluminaFilter({
			...filterIlluminaTissue,
			[value]: checked
		});
		setIlluminaTissueCount(count => (checked ? count + 1 : count - 1));
	};

	const filterGraph = () => {
		let tempGraphData = [];
		illuminaTissueExpressionList.forEach(i => tempGraphData.push({ ...i }));
		let tissueList = [];
		illuminaTissueList.forEach(i => tissueList.push(i));
		tempGraphData.forEach(data => {
			Object.keys(filterIlluminaTissue).map(k => {
				if (!filterIlluminaTissue[k]) {
					const i = tissueList.indexOf(k);
					if (i > -1) tissueList.splice(i, 1);
					delete data[k];
				}
			});
			setNewIlluminaHeatmap(tempGraphData);
			setNewIlluminaTissue(tissueList);
		});
	};

	const updateGTexFilters = ev => {
		const { value, checked } = ev.target;

		setGTexFilter({
			...filterGTexTissue,
			[value]: checked
		});
		setGTexTissueCount(count => (checked ? count + 1 : count - 1));
	};

	const filterGTexGraph = () => {
		let tempGraphData = [];
		gTexTissueExpressionList.forEach(i => tempGraphData.push({ ...i }));
		let tissueList = [];
		gTexTissueList.forEach(i => tissueList.push(i));
		tempGraphData.forEach(data => {
			Object.keys(filterGTexTissue).map(k => {
				if (!filterGTexTissue[k]) {
					const i = tissueList.indexOf(k);
					if (i > -1) tissueList.splice(i, 1);
					delete data[k];
				}
			});
			setNewGTexHeatmap(tempGraphData);
			setNewGTexTissue(tissueList);
		});
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
										tissueList={newIlluminaTissue}
										graphData={newIlluminaHeatmap}
										labelHeight={100}
										graphHeight={illuminaData.length * 100 + 100}
									/>
									<FilterPanel
										selectedTissue={filterIlluminaTissue}
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
					{gTexLoading ? (
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
					)}
				</div>
			</div>
		</div>
	);
};

export default RootContainer;
