import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
const heatmap_colors = ['#edf8e9', '#bae4b3', '#74c476', '#238b45'];

const Heatmap = ({ graphData, tissueList }) => {
	return (
		<div style={{ width: '100vw', height: '500px' }}>
			<ResponsiveHeatMap
				data={graphData}
				keys={tissueList}
				colors={heatmap_colors}
				indexBy="Gene"
				margin={{ top: 0, right: 60, bottom: 0, left: 60 }}
				forceSquare={true}
				axisTop={{
					orient: 'top',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: -90
				}}
				axisRight={null}
				axisBottom={null}
				axisLeft={{
					orient: 'left',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0
				}}
			/>
		</div>
	);
};

export default Heatmap;
