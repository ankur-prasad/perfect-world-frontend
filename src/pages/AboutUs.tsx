import React from 'react'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation isDarkContent={true} />

      <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-[900px]">

            <div className="text-center mb-20">
              <h1 className="text-5xl font-bold tracking-tight mb-4">About Us</h1>
            </div>

            <div className="space-y-10 text-lg leading-relaxed text-gray-700">
              <p>
                Welcome to Perfect World — a movement in fashion led by a passionate team of students
                dedicated to creating meaningful change. Founded by Nico, Perfect World is about more than
                Clothing. We believe in fashion as a statement for impact, a way to unite people in the face of
                shared struggles, and a means to support causes that matter.
              </p>

              <p>
                Our approach goes beyond charity donations; it's about recognizing the interwoven challenges
                our world faces and inspiring collective action. With the slogan 'Together. Not Alone,' we urge
                everyone to stand up, take action together, and find strength in our common purpose. All
                profits go directly to supporting charitable initiatives that make a tangible difference, from
                mental health awareness to environmental preservation.
              </p>

              <p>
                Perfect World is powered entirely by passion. Our team works <span className="italic">pro bono</span>, volunteering time
                and energy because we believe deeply in this vision. Each piece we create embodies our
                commitment to empowering others, fostering connections, and creating a world where
                empathy and action lead to a brighter future.
              </p>

              <p>
                Join us on this journey. Wear your values, share the message, and become part of the
                movement. Together, we can turn pain into purpose and drive change that truly matters.
              </p>

              <p className="font-semibold">
                Thanks for being here with us!
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

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
