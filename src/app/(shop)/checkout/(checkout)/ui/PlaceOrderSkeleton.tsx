import React from 'react'

export const PlaceOrderSkeleton = () => {
	return (
		<div className="bg-white rounded-xl shadow-xl p-7 animate-pulse">
			<div className="h-8 bg-gray-300 rounded mb-4"></div>
			<div className="h-24 bg-gray-300 rounded mb-10"></div>
			<div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>
			<div className="h-8 bg-gray-300 rounded mb-4"></div>
			<div className="grid grid-cols-2 gap-4">
				<div className="h-6 bg-gray-300 rounded"></div>
				<div className="h-6 bg-gray-300 rounded"></div>
				<div className="h-6 bg-gray-300 rounded"></div>
				<div className="h-6 bg-gray-300 rounded"></div>
				<div className="h-6 bg-gray-300 rounded"></div>
				<div className="h-6 bg-gray-300 rounded"></div>
				<div className="h-10 bg-gray-300 rounded mt-5"></div>
				<div className="h-10 bg-gray-300 rounded mt-5"></div>
			</div>
			<div className="mt-5 mb-2 w-full">
				<div className="h-6 bg-gray-300 rounded"></div>
			</div>
		</div>
	)
}
