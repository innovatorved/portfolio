import { BlogPosts } from 'app/components/posts';

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
        {`I'm a Cloud Engineer with a background in web development and experience in React, Next.js, JavaScript, and TypeScript. I began as a freelancer, then transitioned to a Cloud Developer role at LTIMindtree, where I build scalable cloud solutions and explore ML/DL models. My blend of cloud engineering and development expertise helps me deliver efficient, optimized applications. Connect with me here or at vedgupta0401@gmail.com`}
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
