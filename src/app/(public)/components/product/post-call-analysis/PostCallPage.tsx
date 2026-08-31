'use client';

import   { useEffect } from 'react';
import PostHero from './PostHero';
import What from './PostCallAnalysis';
import PostStep from './StepsToAddPostCall';

const PostCallPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white">
            <PostHero />
            <What />
            <PostStep />
        </div>
    );
};

export default PostCallPage;
