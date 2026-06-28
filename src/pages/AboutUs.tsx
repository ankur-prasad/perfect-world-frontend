import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function AboutUs() {
  const location = useLocation()
  const transparencyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (location.hash === '#transparency' || location.pathname === '/transparency') {
      setTimeout(() => {
        transparencyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [location])

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation isDarkContent={true} />

      <main className="pt-8 md:pt-12 pb-20 md:pb-24 px-6 sm:px-8 lg:px-12">
        <div className="flex justify-center">
          <div className="w-full max-w-[900px]">

            <div className="text-center mb-10 md:mb-16">
              <h1 className="text-5xl font-bold tracking-tight mb-4 font-primary">About Us</h1>
            </div>

            <div className="space-y-10 text-lg leading-relaxed text-gray-700 pb-16 border-b border-gray-150">
              <p>
                Hi, and welcome to Perfect World — we're really glad you're here. Perfect World is a fashion brand built on a simple belief: that what you wear can actually mean something. We see fashion as a way to stand together through hard times and back the causes that matter most.
              </p>

              <p>
                Perfect World was founded by Nico, who leads the brand today. We operate independently — Nico at the helm, supported by a dedicated network of friends and collaborators who lend their skills pro bono because they believe in the work. There's no large company behind us, and no one draws a salary; just a committed team putting real time and expertise into something worth doing.
              </p>

              <p>
                Our approach goes a little deeper than simply donating to charity. The challenges our world faces are all tangled up in each other, and we believe the only way through them is together — which is exactly where our slogan comes from: Together. Not Alone. Once a piece is made, 100% of the profit goes straight to the causes we support, from the climate crisis and mental health to ocean restoration and beyond. You can see every cause we back, and exactly where each euro goes, on our Transparency page.
              </p>

              <p>
                And we're not stopping there. There's no shortage of problems in the world right now — so we're always listening, learning, and looking for new causes to take on as we grow.
              </p>

              <p>
                What drives all of this is a feeling we couldn't shake: that change is needed, real change and real improvement, and that waiting around for someone else to make it happen was never good enough. So every piece we make is a small way of doing something about it — empowering people, building connection, and putting a bit more empathy and action into the world.
              </p>

              <p>
                So — come join us. Wear what you believe in, pass the message on, and become part of the movement. Together, we can turn pain into purpose and drive change that truly matters.
              </p>

              <p className="font-semibold text-black">
                Thanks for being here. It means a lot.<br />
                Together. Not Alone.
              </p>

              <div className="pt-12 flex flex-col items-center space-y-8">
                <img
                  src="/assets/images/nicosmile_2048x2048.webp"
                  alt="Nico, Founder of Perfect World"
                  className="w-full max-w-md rounded-lg shadow-lg"
                />

                <a
                  href="/founders"
                  className="inline-block px-8 py-3 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors"
                >
                  Meet the Founders
                </a>
              </div>
            </div>

            {/* Transparency Section */}
            <div ref={transparencyRef} id="transparency" className="pt-20 scroll-mt-24">
              <div className="text-center mb-10 md:mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-primary">Transparency</h2>
              </div>

              <div className="space-y-12 text-lg leading-relaxed text-gray-700">
                <section className="space-y-4">
                  <p className="text-gray-700">
                    Perfect World was built on one promise: every piece you buy becomes a donation, and no one behind the brand takes a cut. This page lays out exactly how that works — because if we're asking you to trust us with a cause, you deserve to see the whole picture.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-2xl font-bold text-black font-primary">How we make our clothing</h3>
                  <p className="text-gray-700">
                    We produce everything through print-on-demand. Nothing is made until you place an order, which means no warehouses of unsold stock, no overproduction, and no waste. Each item is printed once your order comes in, then shipped directly to you. It's slower than holding inventory — but it's the most honest way we've found to make clothing. We only ever make exactly what's wanted.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-2xl font-bold text-black font-primary">How long delivery takes</h3>
                  <p className="text-gray-700">
                    Because we print on demand to avoid overproduction, nothing is made until you order it — which means your piece takes a little longer to reach you than something pulled straight off a warehouse shelf. We'd rather be upfront about that than pretend otherwise:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Production:</strong> 0-3 days</li>
                    <li><strong>In transit:</strong> roughly 6-8 days</li>
                    <li><strong>Order to doorstep:</strong> around 14 days, as a rough estimate</li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    We know that's a wait, and we're sorry for it in advance. It's the honest cost of making clothing without waste — and we're actively working on ways to get your order to you faster.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-2xl font-bold text-black font-primary">Where your money goes</h3>
                  <p className="text-gray-700">
                    When you buy something, your payment covers the cost of producing and shipping the item, along with the small, unavoidable fees any online shop pays to its platform and payment processor. Everything beyond that — the entire profit — is donated.
                  </p>
                  <p className="text-gray-700">
                    No one affiliated with Perfect World pockets a single euro. Not the founder, not anyone behind the brand. No salaries, no commissions, no hidden margins, no "small percentage for operations." After production, 100% goes to the causes below.
                  </p>
                  <p className="text-gray-700">
                    In practice, that's roughly 10-17 € donated per t-shirt and 30-40 € per hoodie. The exact figure shifts a little depending on the product and its price, but the principle never moves.
                  </p>
                  
                  <div className="flex justify-center pt-6 pb-4">
                    <img
                      src="/assets/images/infographic_costs.webp"
                      alt="Infographic showing cost breakdown"
                      className="w-full max-w-2xl h-auto rounded-lg shadow-md"
                    />
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-2xl font-bold text-black font-primary">The five causes you support</h3>
                  <div className="space-y-6 text-gray-700">
                    <p>
                      <strong>Climate crisis</strong> — Funding reforestation and climate action through Plant-for-the-Planet, helping put carbon back where it belongs and protecting the ecosystems we all depend on.
                    </p>
                    <p>
                      <strong>Coral restoration</strong> — Supporting SECORE International's work rebuilding the reefs that hold the ocean together, restoring coral in places where it's been lost.
                    </p>
                    <p>
                      <strong>Mental health</strong> — Helping destigmatise mental health and stand beside people who are struggling, through the Mental Health Initiative. No one should feel alone in it.
                    </p>
                    <p>
                      <strong>Children in Ukraine</strong> — Supporting children whose lives have been upended by the war, through Care in Action.
                    </p>
                    <p>
                      <strong>South America</strong> — Backing Mission Positivity's work with children in the rural communities near Paya, Colombia: a funded speech therapist, school materials and resources, a volunteer program, and environmental education that grows with the kids.
                    </p>
                  </div>
                  
                  <p className="font-semibold text-black mt-8 pt-4 border-t border-gray-150 text-center">
                    Five causes. One promise. Everything we earn, after the shirt is made, goes to them.<br />
                    Together. Not Alone.
                  </p>
                </section>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
