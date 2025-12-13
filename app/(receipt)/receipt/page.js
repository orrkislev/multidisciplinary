'use client';

import { useState } from 'react';
import SeedForm from '../components/SeedForm';
import ReceiptLayout from '../components/ReceiptLayout';
import useReceiptStore from '../utils/receiptStore';
import HomeButton from '@/app/(__components)/HomeButton';

export default function ReceiptPage() {
    const { sessionStarted, addFragments } = useReceiptStore();

    const handleSeedComplete = (data) => {
        // Convert API response to fragments
        const fragments = [];

        // Add chips fragment
        if (data.chips) {
            fragments.push({
                id: 'chips-initial',
                type: 'chips',
                cluster: 'skills',
                content: data.chips,
                used: false,
                dismissed: false
            });
        }

        // Add slider fragments
        if (data.sliders) {
            data.sliders.forEach((slider, index) => {
                fragments.push({
                    id: `slider-${index}`,
                    type: 'slider',
                    cluster: 'process',
                    content: slider,
                    used: false,
                    dismissed: false
                });
            });
        }

        // Add statement fragments
        if (data.statements) {
            data.statements.forEach((statement, index) => {
                fragments.push({
                    id: `statement-${index}`,
                    type: 'statement',
                    cluster: 'process',
                    content: statement,
                    used: false,
                    dismissed: false
                });
            });
        }

        addFragments(fragments);
    };

    return (
        <>
            {!sessionStarted ? (
                <SeedForm onComplete={handleSeedComplete} />
            ) : (
                <ReceiptLayout />
            )}
            <HomeButton />
        </>
    );
}
