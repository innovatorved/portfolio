export default function Resume() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Resume
      </h1>
      <div style={{ width: '100%', height: '100vh' }}>
        <iframe
          src="/pdf/ved-gupta-resume.pdf"
          width="100%"
          height="100%"
        />
      </div>
    </section>
  )
}
