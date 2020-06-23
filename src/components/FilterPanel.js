import React from 'react';
import Dropdown from './Dropdown';

const FilterPanel = ({ tissueList, filterGraph, updateFilter }) => {
	return (
		<div className="filter-panel-root">
			<div className="filter-panel-title">Filter Panel</div>
			<div className="filter-panel">
				<div className="filter-container">
					<div className="tissue-filter">
						Tissues
						<div className="dropdown">
							<Dropdown options={tissueList} updateFilter={updateFilter} />
						</div>
					</div>
					<div>Expression score</div>
				</div>
			</div>
			<div className="button-container">
				<button type="button" className="filter-button" onClick={filterGraph}>
					Filter
				</button>
			</div>
		</div>
	);
};

export default FilterPanel;
