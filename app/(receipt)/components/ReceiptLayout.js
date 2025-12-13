'use client';

import { useState, useEffect } from 'react';
import useReceiptStore from '../utils/receiptStore';
import FragmentSurface from './FragmentSurface';
import ReceiptDisplay from './ReceiptDisplay';

export default function ReceiptLayout() {
    const { responses, addFragments, setIsGenerating, receipt, setTotal, setCoupon } = useReceiptStore();
    const [hasRequestedMore, setHasRequestedMore] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    // Progressive generation - request more fragments after 5 responses
    useEffect(() => {
        if (responses.length >= 5 && !hasRequestedMore) {
            setHasRequestedMore(true);
            generateMoreFragments();
        }
    }, [responses.length, hasRequestedMore]);

    // Auto-complete after 15 responses
    useEffect(() => {
        if (responses.length >= 15 && !hasCompleted) {
            setHasCompleted(true);
            completeReceipt();
        }
    }, [responses.length, hasCompleted]);

    const generateMoreFragments = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/receipt/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses })
            });
            const data = await response.json();

            // Convert data to fragments
            const newFragments = [];

            if (data.fillins) {
                data.fillins.forEach((prompt, i) => {
                    newFragments.push({
                        id: `fillin-${Date.now()}-${i}`,
                        type: 'fillin',
                        cluster: 'process',
                        content: prompt,
                        used: false,
                        dismissed: false
                    });
                });
            }

            if (data.chips) {
                newFragments.push({
                    id: `chips-${Date.now()}`,
                    type: 'chips',
                    cluster: 'skills',
                    content: data.chips,
                    used: false,
                    dismissed: false
                });
            }

            addFragments(newFragments);
        } catch (error) {
            console.error('Error generating more fragments:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const completeReceipt = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/receipt/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses, receipt })
            });
            const data = await response.json();

            if (data.total) setTotal(data.total);
            if (data.coupon) setCoupon(data.coupon);
        } catch (error) {
            console.error('Error completing receipt:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        alert('Export functionality coming soon!');
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Left Panel - Fragment Surface */}
            <div className="w-3/5 overflow-hidden">
                <FragmentSurface />
            </div>

            {/* Right Panel - Receipt */}
            <div className="w-2/5 bg-slate-200 p-8 overflow-y-auto flex flex-col items-center">
                <ReceiptDisplay />

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleExport}
                        className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-all text-sm font-medium"
                    >
                        Export
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium border border-slate-300"
                    >
                        New Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}
