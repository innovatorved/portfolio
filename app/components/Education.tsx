import React from 'react';

const Education = () => {
  return (
    <div className="my-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tighter">Education</h2>
      <div className="space-y-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-lg font-semibold">Galgotias College of Engineering and Technology</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">Aug 2020 - May 2023</span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Bachelor of Technology - BTech, Information Technology
          </p>
        </div>
        
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-lg font-semibold">Government Polytechnic Bahraich</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">2017 - 2020</span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            3 years Technical Diploma
          </p>
        </div>
      </div>
    </div>
  );
};

export default Education;
