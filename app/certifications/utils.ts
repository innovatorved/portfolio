export interface Certification {
  title: string
  issuer: string
  issued: string // ISO or human readable
  credentialId?: string
  url?: string // Verification / credential URL
  image?: string // Path under /public
  remoteImage?: string // Remote CDN image if not stored locally
  description?: string
  skills?: string[]
}

// IMAGE HANDLING NOTES
// Recommended: Download badge images (PNG/SVG) from issuing platforms (Credly, Microsoft Learn, etc.)
// and store them under: public/static/images/certifications
// Then set image: '/static/images/certifications/<file>.png'
// Avoid direct hotlinking to Credly CDN because URLs or access policies can change and may hurt performance.
// Keep alt text meaningful (we reuse the title here in the component).
// If adding many images, consider an import map or dynamic import for optimization.
export function getCertifications(): Certification[] {
  return [
    {
      title: 'Microsoft Certified: Azure Fundamentals',
      issuer: 'Microsoft',
      issued: '2025-05', // From resume: May, 2025
      url: 'https://learn.microsoft.com/api/credentials/share/en-in/innovatorved/6511623ED859592E?sharingId',
      description:
        'Demonstrated foundational knowledge of cloud services with Microsoft Azure: core concepts, services, pricing, SLAs, governance.',
      skills: ['Azure', 'Cloud Concepts', 'Governance', 'Pricing', 'SLAs'],
      image: '/static/images/certifications/azure-fundamentals.png'
      // remoteImage: 'https://learn.microsoft.com/media/credentials/badges/microsoft-certified-fundamentals-badge.svg' // Example (verify actual path)
    },
    {
      title: 'Microsoft Certified: Azure Administrator Associate',
      issuer: 'Microsoft',
      issued: '2025-04-06', // Resume: 6 April 202 (assumed 2025, fixed probable typo)
      url: 'https://learn.microsoft.com/en-in/users/innovatorved/credentials/6c94bf7cd6e82766',
      description:
        'Manage Azure identities/governance, implement storage, deploy & manage compute, virtual networking, monitoring & maintenance of Azure resources.',
      skills: ['Azure AD', 'Storage', 'Compute', 'Virtual Networking', 'Monitoring'],
      image: '/static/images/certifications/azure-administrator.png'
      // remoteImage: 'https://learn.microsoft.com/media/credentials/badges/microsoft-certified-associate-badge.svg'
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
      // remoteImage: 'https://images.credly.com/size/200x200/images/2a0e1f0b-...' // Replace with actual Credly badge URL if desired
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
      // remoteImage: 'https://images.credly.com/...github-foundations.png'
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
      // remoteImage: 'https://certificates.platform.qa.com/static/react-zero-to-hero-badge.png'
    },
  ]
}
