import React from 'react'
import { getCertifications } from '../certifications/utils'
import Image from 'next/image'

const Certifications: React.FC = () => {
  const certs = getCertifications()
  return (
    <div className="my-10">
      <h2 className="mb-7 text-xl font-semibold tracking-tight">Certifications</h2>
      <div className="flex flex-col gap-6">
        {certs.map((c) => (
          <div
            key={c.title}
            className="group relative p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold flex items-center gap-3 leading-snug">
                {c.image ? (
                  // Local static image (hashed by file path)
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-12 w-12 rounded-md border border-neutral-200 dark:border-neutral-800 object-cover shadow-sm"
                  />
                ) : c.remoteImage ? (
                  <Image
                    src={c.remoteImage}
                    alt={c.title}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md border border-neutral-200 dark:border-neutral-800 object-cover shadow-sm"
                  />
                ) : null}
                <span>{c.title}</span>
              </h3>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap mt-0.5">
                {c.issued}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 tracking-wide">
              {c.issuer}
              {c.credentialId && (
                <span className="ml-2 text-[10px] text-neutral-500 dark:text-neutral-400">ID: {c.credentialId}</span>
              )}
            </p>
            {c.description && (
              <p className="mt-2 text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-[14]">
                {c.description}
              </p>
            )}
            {(c.skills?.length || 0) > 0 && (
              <ul className="flex flex-wrap gap-1.5 mt-3">
                {c.skills!.map((s) => (
                  <li
                    key={s}
                    className="text-[10px] tracking-wide px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
            {c.url && (
              <div className="mt-4 flex">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[12px] font-medium text-neutral-800 dark:text-neutral-200 underline decoration-dotted underline-offset-4 group-hover:decoration-solid"
                >
                  View Credential
                  <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                </a>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-transparent group-hover:ring-blue-300/40 dark:group-hover:ring-blue-500/30 transition" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Certifications
