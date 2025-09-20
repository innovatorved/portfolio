export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Projects
      </h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">
            <a href="https://vedgupta.in/blog/whisper-openai-web-ui-implementation">
              Web UI Implementation of Whisper to transcribe the Speech
            </a>
          </h2>
          <p>
            A web UI for OpenAI's Whisper model to transcribe speech from audio files.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            <a href="https://vedgupta.in/blog/prenotebook-alternative-to-google-keep">
              Prenotebook a web based open source note taking Service
            </a>
          </h2>
          <p>
            An open-source, web-based note-taking service.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            <a href="https://vedgupta.in/blog/textmanipulator-maipulate-your-text">
              Text Manipulator , a new way to play with your text
            </a>
          </h2>
          <p>
            A tool for manipulating text in various ways.
          </p>
        </div>
      </div>
    </section>
  )
}
