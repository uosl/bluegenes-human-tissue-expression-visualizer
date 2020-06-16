import React, { useEffect, useState } from 'react';
import { queryData } from './query';

const RootContainer = ({ serviceUrl, entity }) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		let { value } = entity;
		queryData({
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setData(data);
		});
	}, []);
	return (
		<div className="rootContainer">
			<h1>Your Data Viz Here</h1>
		</div>
	);
};

export default RootContainer;
