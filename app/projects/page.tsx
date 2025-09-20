import { ProjectPosts } from 'app/components/project-posts'

export const metadata = {
  title: 'Projects',
  description: 'A list of my projects.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Projects</h1>
      <p className="text-neutral-600 dark:text-neutral-300 mb-8">
        I've created a variety of small, useful projects. You can explore them on my{' '}
        <a
          href="https://github.com/innovatorved"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-800 dark:hover:text-neutral-100"
        >
          GitHub profile
        </a>
        .
      </p>
      <ProjectPosts />
    </section>
  )
}
