import React from 'react';
import { HeatMap } from '@nivo/heatmap';
const heatmap_colors = ['#edf8e9', '#bae4b3', '#74c476', '#238b45'];

const Heatmap = ({ graphData, tissueList, labelHeight, graphHeight }) => {
	return (
		<div
			style={{
				width: 'calc(100vw - 5rem)',
				height: graphHeight,
				textAlign: 'center',
				overflowX: 'scroll',
				overflowY: 'hidden'
			}}
		>
			{tissueList.length ? (
				<HeatMap
					data={graphData}
					keys={tissueList.map(t => t.value)}
					colors={heatmap_colors}
					indexBy="Gene"
					margin={{ top: labelHeight, right: 60, bottom: 0, left: 60 }}
					forceSquare={true}
					axisTop={{
						orient: 'top',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: -90
					}}
					height={graphHeight}
					width={tissueList.length * 50 + 100}
					axisRight={null}
					axisBottom={null}
					axisLeft={{
						orient: 'left',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0
					}}
					cellBorderWidth={2}
					cellHoverOthersOpacity={1}
					cellOpacity={1}
				/>
			) : (
				<div className="noTissue">Please Select Any Tissue</div>
			)}
		</div>
	);
};

export default Heatmap;
