import { useState, useMemo, useCallback, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How do you produce your clothing?",
        answer: "At Perfect World, we use Stanley/Stella to produce our clothing. They are committed to 100% environmentally friendly practices and fair production methods. This means every piece is made with respect for both the planet and the people who make it, ensuring high-quality, sustainable, and ethical apparel."
    },
    {
        question: "Do you accept refunds?",
        answer: "Due to all profits being donated as well as the product being printed on Demand for every purchase, refunds / exchanges are not possible. Please check the size chart carefully. In the case that your product is faulty, message support@perfectworld.global! Thanks for your support!"
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

interface FAQItemProps {
    faq: typeof faqs[0];
    index: number;
    isActive: boolean;
    onClick: () => void;
}

function FAQItem({ faq, index, isActive, onClick }: FAQItemProps) {
    const [hovered, setHovered] = useState(false);
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        startTransition(() => {
            setMouse({
                x: Math.max(0, Math.min(1, x)),
                y: Math.max(0, Math.min(1, y))
            });
        });
    }, []);

    const highlightStyle = useMemo(() => {
        const dx = mouse.x - 0.5;
        const dy = mouse.y - 0.5;
        const offsetX = dx * (hovered ? 28 : 16);
        const offsetY = dy * (hovered ? 28 : 16);

        return {
            position: 'absolute' as const,
            left: `calc(50% + ${offsetX}px)`,
            top: `calc(50% + ${offsetY + (hovered ? -4 : 0)}px)`,
            width: hovered ? '74%' : '60%',
            height: hovered ? '42%' : '30%',
            background: hovered
                ? 'linear-gradient(120deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.18) 100%)'
                : 'linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 100%)',
            borderRadius: '50%',
            filter: `blur(${hovered ? 22 : 14}px)`,
            opacity: hovered ? 0.82 : 0.5,
            pointerEvents: 'none' as const,
            transform: `translate(-50%, -50%) scale(${hovered ? 1.13 : 1})${hovered ? ' translateY(-2.5px)' : ''}`,
            transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 2
        };
    }, [hovered, mouse]);

    const reflectionStyle = useMemo(() => {
        const dx = mouse.x - 0.5;
        const dy = mouse.y - 0.5;
        const offsetX = dx * (hovered ? 16 : 8);
        const offsetY = dy * (hovered ? 16 : 8);

        return {
            position: 'absolute' as const,
            left: `calc(50% + ${offsetX}px)`,
            top: `calc(50% + ${offsetY}px)`,
            width: hovered ? '38%' : '30%',
            height: hovered ? '18%' : '14%',
            background: 'linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)',
            borderRadius: '50%',
            filter: `blur(${hovered ? 10 : 7}px)`,
            opacity: hovered ? 0.45 : 0.28,
            pointerEvents: 'none' as const,
            transform: `translate(-50%, -50%) scale(${hovered ? 1.12 : 1})${hovered ? ' translateY(-1px)' : ''}`,
            transition: 'all 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1
        };
    }, [hovered, mouse]);

    return (
        <motion.div
            className="rounded-3xl overflow-hidden cursor-pointer relative"
            style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%), ${hovered ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`,
                border: '1.5px solid rgba(255, 255, 255, 0.22)',
                boxShadow: hovered
                    ? '0 18px 48px 0 rgba(0, 0, 0, 0.18), 0 6px 24px 0 rgba(0, 0, 0, 0.12)'
                    : '0 6px 18px 0 rgba(0, 0, 0, 0.10)',
                backdropFilter: 'blur(18px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
                transition: 'box-shadow 0.32s cubic-bezier(0.4, 0, 0.2, 1), background 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setMouse({ x: 0.5, y: 0.5 });
            }}
        >
            {/* Glassy highlight effect */}
            <div style={highlightStyle} />
            <div style={reflectionStyle} />

            {/* Inset border for depth */}
            <div
                style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    border: '1.5px solid rgba(255,255,255,0.22)',
                    boxShadow: 'inset 0 1.5px 8px 0 rgba(255,255,255,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.06)',
                    zIndex: 4
                }}
            />

            <div
                onClick={onClick}
                className="relative z-10"
                style={{
                    padding: '12px 32px'
                }}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-normal text-black text-left font-primary">
                            {faq.question}
                        </h3>
                    </div>

                    <motion.div
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center relative"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.08)'
                        }}
                        animate={{
                            rotate: isActive ? 90 : -90
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 60,
                            mass: 1
                        }}
                    >
                        {/* Horizontal line */}
                        <motion.div
                            className="absolute w-3 h-px bg-black"
                            animate={{
                                rotate: isActive ? 90 : -90
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 60,
                                mass: 1
                            }}
                        />
                        {/* Vertical line */}
                        <motion.div
                            className="absolute h-3 w-px bg-black"
                            animate={{
                                rotate: isActive ? 90 : -180
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 60,
                                mass: 1
                            }}
                        />
                    </motion.div>
                </div>

                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                height: 0,
                                marginTop: 0
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                                marginTop: 16
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                                marginTop: 0
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 60,
                                mass: 1
                            }}
                        >
                            <p className="text-base text-black/80 leading-relaxed text-left">
                                {faq.answer}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="min-h-screen bg-gray-50 text-black relative z-10 flex items-center py-20">
            <div className="flex justify-center w-full">
                <div className="w-full px-4 max-w-[800px]">
                    <motion.h2
                        className="text-5xl md:text-6xl font-bold mb-12 text-center"
                        style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Frequently Asked Questions
                    </motion.h2>

                    <div
                        className="rounded-[26px] overflow-hidden p-1"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        <div className="flex flex-col gap-0.5">
                            {faqs.map((faq, index) => (
                                <FAQItem
                                    key={index}
                                    faq={faq}
                                    index={index}
                                    isActive={activeIndex === index}
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
