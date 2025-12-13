'use client';

import ChipsFragment from './fragments/ChipsFragment';
import SliderFragment from './fragments/SliderFragment';
import StatementFragment from './fragments/StatementFragment';
import FillInFragment from './fragments/FillInFragment';
import useReceiptStore from '../utils/receiptStore';

export default function FragmentSurface() {
    const { fragments, isGenerating } = useReceiptStore();

    const activeFragments = fragments.filter(f => !f.used && !f.dismissed);

    return (
        <div className="space-y-4 p-6 overflow-y-auto max-h-screen">
            {isGenerating && (
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                    <div className="animate-pulse text-blue-600 font-medium">
                        Generating reflection prompts...
                    </div>
                </div>
            )}

            {activeFragments.map((fragment) => {
                switch (fragment.type) {
                    case 'chips':
                        return (
                            <ChipsFragment
                                key={fragment.id}
                                chips={fragment.content}
                                fragmentId={fragment.id}
                            />
                        );
                    case 'slider':
                        return (
                            <SliderFragment
                                key={fragment.id}
                                slider={fragment.content}
                                fragmentId={fragment.id}
                            />
                        );
                    case 'statement':
                        return (
                            <StatementFragment
                                key={fragment.id}
                                statement={fragment.content}
                                fragmentId={fragment.id}
                            />
                        );
                    case 'fillin':
                        return (
                            <FillInFragment
                                key={fragment.id}
                                prompt={fragment.content}
                                fragmentId={fragment.id}
                            />
                        );
                    default:
                        return null;
                }
            })}

            {!isGenerating && activeFragments.length === 0 && (
                <div className="text-center text-slate-400 py-12">
                    No more prompts. Your receipt is ready!
                </div>
            )}
        </div>
    );
}
