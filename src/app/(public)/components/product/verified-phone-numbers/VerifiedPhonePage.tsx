'use client';

import   { useEffect } from 'react';
import VerifiedHero from './VerifiedHero';
import What from './What';
import VerifiedSteps from './VerifiedSteps';


const VerifiedPhonePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white">
            <VerifiedHero />
            <What />
            <VerifiedSteps />
        </div>
    );
};

export default VerifiedPhonePage;
