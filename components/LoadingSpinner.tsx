
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4 my-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
  </div>
);

export default LoadingSpinner;
