import React from 'react';

export const ProductsInCartSkeleton = () => {
    return (
        <>
            <div className="flex mb-5">
                <div className="w-[100px] h-[100px] mr-5 bg-gray-200 animate-pulse rounded" />
                <div>
                    <span className="bg-gray-200 w-20 h-5 block mb-2 animate-pulse" />
                    <p className="bg-gray-200 w-20 h-5 block mb-2 animate-pulse" />
                </div>
            </div>
            <div className="flex mb-5">
                <div className="w-[100px] h-[100px] mr-5 bg-gray-200 animate-pulse rounded" />
                <div>
                    <span className="bg-gray-200 w-20 h-5 block mb-2 animate-pulse" />
                    <p className="bg-gray-200 w-20 h-5 block mb-2 animate-pulse" />
                </div>
            </div>
        </>
    );
};
