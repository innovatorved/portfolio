export interface Certification {
    title: string;
    issuer: string;
    issued: string;
    credentialId?: string;
    url?: string;
    image?: string;
    remoteImage?: string;
    description?: string;
    skills?: string[];
}

export const certifications: Certification[] = [
    {
        title: 'Microsoft Certified: Azure AI Fundamentals',
        issuer: 'Microsoft',
        issued: '2026-01-18',
        url: 'https://learn.microsoft.com/en-in/users/innovatorved/credentials/C0CE5CB516A4E697',
        description:
            'Demonstrated foundational knowledge of machine learning and AI concepts, along with Azure AI services including computer vision, natural language processing, and generative AI.',
        skills: ['Azure AI', 'Machine Learning', 'Computer Vision', 'NLP', 'Generative AI', 'Cognitive Services'],
        image: '/static/images/certifications/azure-ai-fundamentals.png'
    },
    {
        title: 'Microsoft Certified: Azure Fundamentals',
        issuer: 'Microsoft',
        issued: '2025-05',
        url: 'https://learn.microsoft.com/api/credentials/share/en-in/innovatorved/6511623ED859592E?sharingId',
        description:
            'Demonstrated foundational knowledge of cloud services with Microsoft Azure: core concepts, services, pricing, SLAs, governance.',
        skills: ['Azure', 'Cloud Concepts', 'Governance', 'Pricing', 'SLAs'],
        image: '/static/images/certifications/azure-fundamentals.png'
    },
    {
        title: 'Microsoft Certified: Azure Administrator Associate',
        issuer: 'Microsoft',
        issued: '2025-04-06',
        url: 'https://learn.microsoft.com/en-in/users/innovatorved/credentials/6c94bf7cd6e82766',
        description:
            'Manage Azure identities/governance, implement storage, deploy & manage compute, virtual networking, monitoring & maintenance of Azure resources.',
        skills: ['Azure AD', 'Storage', 'Compute', 'Virtual Networking', 'Monitoring'],
        image: '/static/images/certifications/azure-administrator.png'
    },
    {
        title: 'Associate Cloud Engineer',
        issuer: 'Google Cloud',
        issued: '2024-10-23',
        url: 'https://www.credly.com/badges/34a38859-04f5-4548-a543-e871e740db36/',
        description:
            'Validated ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud. Involves foundational knowledge of core services, IAM, networking, storage, and security best practices.',
        skills: [
            'GCP',
            'Cloud Architecture',
            'IAM',
            'Networking',
            'Compute Engine',
            'Cloud Storage',
            'Pub/Sub',
            'Security',
            'Infrastructure as Code',
            'SQL',
        ],
        image: '/static/images/certifications/gcp-associate-cloud-engineer.png'
    },
    {
        title: 'GitHub Foundations',
        issuer: 'GitHub',
        issued: '2024-11-29',
        url: 'https://www.credly.com/badges/616b1e3c-7b47-464b-ad2f-5d9d04d07985/public_url',
        description:
            'Covers repository management, collaborative workflows, CI, DevOps principles, version control fundamentals, and project management on GitHub.',
        skills: ['Git', 'GitHub Actions', 'CI/CD', 'Collaboration', 'Version Control'],
        image: '/static/images/certifications/github-foundations.png'
    },
    {
        title: 'ReactJS: Zero to Hero',
        issuer: 'QA Ltd',
        issued: '2024-08',
        url: 'https://certificates.platform.qa.com/4c2ab58979101bc6a8e277c746325c2c35702052.pdf',
        description:
            'Comprehensive course from fundamentals to advanced React: components, props, state, hooks, routing, performance optimization, building dynamic responsive apps.',
        skills: ['React', 'Hooks', 'Routing', 'State Management', 'Performance'],
        image: '/static/images/certifications/react-zero-to-hero.svg'
    },
];
