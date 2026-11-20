// A stand-in until each page is built
export function PlaceholderPage({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl">{title}</h1>
      <p className="mt-4 text-cocoa-400">{text}</p>
    </section>
  )
}