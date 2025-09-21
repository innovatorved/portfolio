import React from 'react';

const Education = () => {
  return (
    <div className="my-8">
      <h2 className="mb-8 text-xl font-semibold tracking-tighter">Education</h2>
      <div className="relative border-l-2 border-gray-200">
        <div className="mb-8 ml-6">
          <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-gray-200 ring-8 ring-white"></span>
          <h3 className="font-semibold">Galgotias College of Engineering and Technology</h3>
          <p className="text-sm text-gray-500">Bachelor of Technology - BTech, Information Technology | August 2020 to May 2023</p>
        </div>
        <div className="mb-8 ml-6">
          <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-gray-200 ring-8 ring-white"></span>
          <h3 className="font-semibold">Goverment Polytechnic Bahraich</h3>
          <p className="text-sm text-gray-500">Diploma | 2017 - 2020</p>
        </div>
      </div>
    </div>
  );
};

export default Education;
