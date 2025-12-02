import React from 'react';
import Navigation from '../components/Layout/Navigation';
import Footer from '../components/Layout/Footer';

const Transparency = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation isDarkContent={true} />

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[900px]">

            {/* Page Title */}
            <div className="text-center mb-20">
              <h1 className="text-5xl font-bold tracking-tight mb-4">Transparency</h1>
            </div>

            {/* Section 1 */}
            <section className="space-y-12 mb-20">
              <h2 className="text-3xl font-semibold">How we see Transparency?</h2>
              <p className="text-lg leading-relaxed text-gray-700">
                We believe that being transparent in our actions is important so that you can see how your
                support is changing the world. On this page, we detail where your money goes, from t-shirt
                production to donation to charities.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-12 mb-20">
              <h2 className="text-3xl font-semibold">Why are we using POD?</h2>
              <p className="text-lg leading-relaxed text-gray-700">
                We use print-on-demand service, which allows us to reduce price and environmental footprint by adapting to actual demand in real time and eliminating the need for storage space.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-12">
              <h2 className="text-3xl font-semibold">How do we calculate our costs?</h2>
              <div className="flex justify-center">
                <img
                  src="/assets/images/infographic_costs.webp"
                  alt="Infographic showing cost breakdown"
                  className="w-full max-w-2xl h-auto rounded-lg shadow-md"
                />
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Transparency;
