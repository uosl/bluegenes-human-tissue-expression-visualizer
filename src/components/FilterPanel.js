import React from 'react';

const FilterPanel = ({ selectedTissue, checkedCount }) => {
	return (
		<div className="filter-panel-root">
			<div className="filter-panel-title">Available Tissues</div>
			<div className="filter-panel">
				<div className="filter-container">
					{Object.keys(selectedTissue).map(term => (
						<>
							<div className="option">
								<div>
									<input
										type="checkbox"
										id={term}
										value={term}
										checked={selectedTissue[term]}
									/>
									<label htmlFor={term}>{term}</label>
								</div>
							</div>
						</>
					))}
				</div>
			</div>
			<div className="button-container">
				<button type="button" className="filter-button">
					Filter ({checkedCount})
				</button>
			</div>
		</div>
	);
};
export default FilterPanel;
