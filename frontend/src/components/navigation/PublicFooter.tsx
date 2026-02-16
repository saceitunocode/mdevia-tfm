/* PublicFooter.tsx */

import React from 'react';

const PublicFooter: React.FC = () => { 
    return (
        <footer>
            <nav>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/terms">Terms</a></li>
                    <li><a href="/privacy">Privacy</a></li>
                </ul>
            </nav>
        </footer>
    );
};

export default PublicFooter;