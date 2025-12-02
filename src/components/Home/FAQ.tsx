import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How do you produce your clothing?",
        answer: "At Perfect World, we use Stanley/Stella to produce our clothing. They are committed to 100% environmentally friendly practices and fair production methods. This means every piece is made with respect for both the planet and the people who make it, ensuring high-quality,sustainable, and ethical apparel."
    },
    {
        question: "Do you accept refunds?",
        answer: "Due to all profits being donated as well as the product being printed on Demand for every purchase, refunds / exchanges are not possible. Please check the size chart carefully. In the case that your product is faulty, message support@perfectworld. global! thanks for your support!"
    },
    {
        question: "Can I cancel my order?",
        answer: "Unfortunately, since we donate all profits and use a Print on Demand Service, the same rules as issuing refunds pertains. Please be sure of your purchase, and check the size charts on each individual product! We appreciate your support, but in the current stage of our brand, we are not able to issue cancellations or refunds."
    },
    {
        question: "How can I get in touch with you?",
        answer: "Our support email is support@perfectworld.global, for any questions or feedback please get in touch with us here :)"
    },
    {
        question: "Where do you ship to?",
        answer: "Since we use a Print on Demand service, we are able to ship everywhere internationally! Shipping will usually take 1-2 Weeks, depending on location."
    },
    {
        question: "How do I know where my money will go, or if it is really donated?",
        answer: "As our brand grows, so will our transparency page. This is where you will then be able to see all of our expenditures and donations. Rest assured, in the last year, we have all been working Pro Bono to assure that all profits are truly donated. We appreciate your support in our movement and want to be as transparent as possible."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="min-h-screen bg-gray-50 text-black relative z-10 flex items-center py-20">
            <div className="flex justify-center w-full">
                <div className="w-full px-4 max-w-[1200px]">
                    <motion.h2
                        className="text-5xl md:text-6xl font-bold mb-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Frequently Asked Questions
                    </motion.h2>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="border border-gray-200 rounded-xl bg-white overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-2xl font-semibold">{faq.question}</span>
                                    <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-8 pb-8 text-lg text-gray-700 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
