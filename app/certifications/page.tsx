import Certifications from '../components/Certifications'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Professional certifications and verified credentials of Ved Gupta (innovatorved | vedgupta).',
}

export default function CertificationsPage() {
  return (
    <section>
      <p className="text-neutral-700 dark:text-neutral-300 mb-6 text-sm leading-relaxed">
        A curated list of professional certifications and credentials. These validate skills across cloud, development, and AI tooling. More being added as I continue learning.
      </p>
      <Certifications />
    </section>
  )
}
