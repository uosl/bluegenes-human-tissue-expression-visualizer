import React from 'react';
import Dropdown from './Dropdown';

const FilterPanel = ({
	tissueList,
	filterTissue,
	updateFilter,
	expressionLevelFilter,
	selectedExpression,
	selectedScale,
	scaleFilter,
	selectedDataSet,
	filterDataSet
}) => {
	return (
		<div className="filter-container">
			<div className="tissue-filter">
				Tissues
				<div className="dropdown">
					<Dropdown
						options={tissueList}
						updateFilter={updateFilter}
						filterTissue={filterTissue}
					/>
				</div>
			</div>
			<div className="expression-filter">
				Expression Level
				<div className="filter-option">
					{Object.keys(selectedExpression).map(term => (
						<label key={term}>
							<div
								className={
									selectedExpression[term]
										? 'option selected'
										: 'option not-selected'
								}
							>
								<input
									type="checkbox"
									value={term}
									onChange={expressionLevelFilter}
									checked={selectedExpression[term]}
								/>
								{term}
							</div>
						</label>
					))}
				</div>
				<div className="legend"></div>
			</div>
			<div className="data-set-filter">
				Data Set
				<div className="filter-option">
					{['GTex Data', 'RNA Seq Data', 'illumina Body Map'].map(term => (
						<label key={term}>
							<div
								className={
									selectedDataSet == term
										? 'option selected'
										: 'option not-selected'
								}
							>
								<input
									type="checkbox"
									value={term}
									onChange={filterDataSet}
									checked={selectedDataSet == term}
								/>
								{term}
							</div>
						</label>
					))}
				</div>
			</div>
			<div className="scale-filter">
				Scale
				<div className="filter-option">
					{['Linear Scale', 'Logarithmic Scale'].map(term => (
						<label key={term}>
							<div
								className={
									selectedScale === term
										? 'option selected'
										: 'option not-selected'
								}
							>
								<input
									type="radio"
									value={term}
									onChange={scaleFilter}
									checked={selectedScale === term}
								/>
								{term}
							</div>
						</label>
					))}
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
