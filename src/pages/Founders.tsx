import React from 'react';
import Navigation from '../components/Layout/Navigation';
import Footer from '../components/Layout/Footer';

const Founders = () => {
    return (
        <div className="min-h-screen bg-white text-black">
            <Navigation isDarkContent={true} />

            <main className="pt-40 md:pt-48 pb-32 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                    <div className="w-full max-w-[900px] text-center">
                        <h1 className="text-5xl font-bold tracking-tight mb-8">Founders</h1>
                        <p className="text-xl text-gray-600">Coming Soon</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Founders;
