
import Navigation from '../components/Layout/Navigation';
import Footer from '../components/Layout/Footer';

const Founders = () => {
    return (
        <div className="min-h-screen bg-white text-black">
            <Navigation isDarkContent={true} />

            <main className="pt-10 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                    <div className="w-full max-w-[900px]">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 md:mb-16 text-center font-primary">From Pain to Purpose</h1>

                        {/* Nico's Photo */}
                        <div className="flex justify-center mb-12">
                            <img
                                src="/assets/images/nicosmile_2048x2048.webp"
                                alt="Nico, Founder of Perfect World"
                                className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl"
                                style={{ objectPosition: 'center 0%' }}
                            />
                        </div>

                        <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-800">
                            <p>Hi, I'm Nico — and Perfect World started long before the brand ever existed.</p>

                            <p>I spent nine months in a hospital — long enough to realize that my pain wasn't unique.</p>

                            <p>Everyone around me was carrying something.<br/>
                            Fear, sadness, loneliness, pressure…</p>

                            <p>And yet, even in all that heaviness, I saw something else:<br/>
                            People helping each other.<br/>
                            People caring.<br/>
                            People trying.</p>

                            <p>It changed me.</p>

                            <p className="pt-4">I had always lived a privileged life —<br/>
                            South Africa, Germany, California, Spain…<br/>
                            I saw beautiful places, met incredible people, and learned what opportunity feels like.</p>

                            <p>But I also learned what responsibility feels like.</p>

                            <p><strong>Because privilege without action is just comfort.<br/>
                            And comfort alone never changed anything.</strong></p>

                            <p className="pt-4">During that time in the hospital, I realized something simple, but important:</p>

                            <p><em>My pain isn't special.<br/>
                            But what I do with it can be.</em></p>

                            <p className="pt-4">I wanted to give back.<br/>
                            I wanted to create something that didn't just exist,<br/>
                            but <strong>helped</strong>.</p>

                            <p>And that's how Perfect World began —<br/>
                            not as a fashion brand,<br/>
                            but as a way to turn everyday choices into something meaningful.</p>

                            <p className="pt-4">I didn't have the perfect business plan.<br/>
                            I didn't know anything about fashion.<br/>
                            I didn't have an investor.</p>

                            <p>I just had one belief:<br/>
                            <strong>Money should help people, not hurt them.</strong></p>

                            <p className="pt-4">So I made a decision that many people laughed at:<br/>
                            I would donate 100% of profits.<br/>
                            Everything.<br/>
                            Every hoodie, every shirt, every euro.</p>

                            <p>Because greed created enough damage in the world —<br/>
                            I didn't want to add to it.</p>

                            <p>I wanted to show that business can be done differently.<br/>
                            Human. Honest. Connected.</p>

                            <p className="pt-4"><strong>Perfect World isn't about clothes.</strong><br/>
                            It's about the people wearing them.</p>

                            <p>It's about giving you a way to stand for something,<br/>
                            even if you don't always know where to begin.</p>

                            <p>It's about hope — not the naïve kind,<br/>
                            but the stubborn kind.</p>

                            <p>The kind that says:<br/>
                            <strong>We can do better. Together.</strong></p>

                            <p className="pt-4">I built this movement because I've received more love in my life than I ever deserved.<br/>
                            This is my way of giving some of it back.</p>

                            <p className="pt-4">And if you're reading this,<br/>
                            I hope you feel it too —<br/>
                            that pull toward something meaningful,<br/>
                            something hopeful,<br/>
                            something that reminds you that your choices matter.</p>

                            <p className="pt-4"><strong>Perfect World isn't mine anymore.<br/>
                            It's ours.</strong></p>

                            <p className="pt-6">Thanks for being here.<br/>
                            Truly.</p>

                            <p className="text-2xl font-semibold pt-2">Nico</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Founders;
