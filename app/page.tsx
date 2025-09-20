import { BlogPosts } from 'app/components/posts';
import Image from 'next/image';

export default function Page() {
  return (
    <section>
      <Image
        src="/avatar.jpg"
        alt="An image of Ved Gupta"
        width={100}
        height={100}
        className="rounded-full mb-4"
      />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Ved Prakash Gupta
      </h1>
      <p className="mb-4">
        Student and Tech enthusiast Developer
      </p>
      <p className="mb-4">
        {`It's my passion to write code and solve problems as a Software
        Developer. Love to help Developers. Always Open for Contributions`}
      </p>
      <div className="my-8">
        <h2 className="mb-8 text-xl font-semibold tracking-tighter">
          Featured Posts
        </h2>
        <BlogPosts />
      </div>
    </section>
  )
}
