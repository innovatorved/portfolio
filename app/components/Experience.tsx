import React from 'react';

const Experience = () => {
  return (
    <div className="my-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tighter">Experience</h2>
      <div className="space-y-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-lg font-semibold">LTIMindtree</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">Mar 2024 - Present</span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Cloud Engineer • Hyderabad, India
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 ml-4">
            <li className="list-disc">
              Working on Microsoft Azure Cloud projects with focus on Infrastructure as a Service (IaaS), optimizing and managing cloud infrastructure.
            </li>
            <li className="list-disc">
              Implementing and deploying scalable, secure, and efficient cloud solutions on Azure.
            </li>
            <li className="list-disc">
              Collaborating with teams to design and deploy cloud architectures aligned with business needs.
            </li>
            <li className="list-disc">
              Providing solutions for clients by designing, deploying, and managing Azure IaaS environments tailored to their specific needs.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Experience;
