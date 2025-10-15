import { BlogPosts } from 'app/components/posts';
import Experience from 'app/components/Experience';
import Education from 'app/components/Education';

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Ved Prakash Gupta
      </h1>
      <p className="mb-4">
        Full Stack Developer | React Developer | Generative AI Developer | Azure Cloud Certified | Google Cloud Certified | Python Developer
      </p>
      <p className="mb-4">
        {`Cloud Developer with a strong background in cloud solutions and web development. After starting as a freelancer, I gained expertise in React, Next.js, JavaScript, TypeScript, Docker, Kubernetes, DevOps. Currently, I work at LTIMindtree, where I focus on designing and implementing scalable cloud infrastructure. I am passionate about open-source contributions and enjoy creating projects to explore and innovate with new technologies. Connect with me here or at vedgupta0401@gmail.com`}
      </p>
      <Experience />
      <Education />
      <div className="my-8">
        <h2 className="mb-8 text-xl font-semibold tracking-tighter">
          Featured Posts
        </h2>
        <BlogPosts />
      </div>
    </section>
  )
}
