import React from 'react';
import { styled } from '@/utils/tw';

const DialContainer = styled.div`
    absolute bottom-16 left-[50%] transform translate-x-[-50%] w-20 h-20;
    margin: 1rem 0;
    text-align: center;
`;

export function UnderstandingMeter({ value }) {
    // Map value (-10 to 10) to angle (-60° to 60°)
    const angle = (value / 10) * 60;
    return (
        <DialContainer>
            <svg viewBox="0 0 200 200" width="200" height="200">
                {/* Draw dial circle */}
                <circle cx="100" cy="100" r="80" fill="#888" strokeWidth="2" />
                {/* Needle */}
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="30"
                    stroke="brown"
                    strokeWidth="8"
                    strokeLinecap="round"
                    transform={`rotate(${angle}, 100, 100)`}
                />
            </svg>
        </DialContainer>
    );
}
