import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            ContentShift
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="inline-block mb-4 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            AI-Powered Content Repurposing
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            One piece of content.
            <br />
            <span className="text-blue-600">Every platform.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Paste your blog post, article, or transcript. Get perfectly formatted
            content for Twitter, LinkedIn, email newsletters, and Instagram in
            seconds.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Start Free — 5 repurposes/day
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              View Pricing
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Paste your content",
                  desc: "Blog post, video transcript, article, or any long-form text.",
                },
                {
                  step: "2",
                  title: "Choose formats",
                  desc: "Select which platforms you want: Twitter, LinkedIn, email, Instagram.",
                },
                {
                  step: "3",
                  title: "Get results instantly",
                  desc: "AI generates platform-optimized content you can copy and post.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-lg font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Output formats
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Twitter/X Thread",
                  desc: "Hook + numbered tweets + CTA",
                  icon: "𝕏",
                },
                {
                  name: "LinkedIn Post",
                  desc: "Professional tone, formatted for engagement",
                  icon: "in",
                },
                {
                  name: "Email Newsletter",
                  desc: "Subject line + body + CTA",
                  icon: "✉",
                },
                {
                  name: "Instagram Caption",
                  desc: "Story format + hashtags",
                  icon: "📷",
                },
              ].map((format) => (
                <div
                  key={format.name}
                  className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="text-2xl mb-3">{format.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {format.name}
                  </h3>
                  <p className="text-sm text-slate-600">{format.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stop manually rewriting content
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join content creators who save hours every week with AI-powered
              repurposing. Start free today.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-slate-900 bg-white rounded-lg hover:bg-slate-100"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ContentShift. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
