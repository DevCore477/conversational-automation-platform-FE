'use client';

import   { useEffect } from 'react';
import NavigateHero from './NavigateHero';
import When from './WhenUseNavigateIVR';
import NavigateStep from './NavigateStepsToUse';

const NavigateIVRPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-white min-h-screen">
            <NavigateHero />
            <When />
            <NavigateStep />
        </main>
    );
};

export default NavigateIVRPage;
