import React from 'react';

const Experience = () => {
  return (
    <div className="my-8">
      <h2 className="mb-4 text-xl font-semibold tracking-tighter">Experience</h2>
      <div className="border-l-2 border-gray-200 pl-4">
        <div className="mb-8">
          <h3 className="font-semibold">LTIMindtree</h3>
          <p className="text-sm text-gray-500">Cloud Engineer | Mar 2024 to Present | Hyderabad, India</p>
          <ul className="list-disc list-inside mt-2 text-neutral-800 dark:text-neutral-200">
            <li>Working on a Microsoft Azure Cloud project with a focus on Infrastructure as a Service (IaaS), optimizing and managing cloud infrastructure.</li>
            <li>Implementing and deploying scalable, secure, and efficient cloud solutions on Azure.</li>
            <li>Collaborating with teams to design and deploy cloud architectures aligned with business needs.</li>
            <li>Providing solutions for clients by designing, deploying, and managing Azure IaaS environments tailored to their specific needs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Experience;
