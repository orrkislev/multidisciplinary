'use client';

import { useState } from 'react';
import useReceiptStore from '../utils/receiptStore';

function ReceiptLineItem({ item, section, index }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLabel, setEditedLabel] = useState(item.label);
    const [editedQuantity, setEditedQuantity] = useState(item.quantity);
    const { updateReceiptItem, removeReceiptItem } = useReceiptStore();

    const handleSave = () => {
        updateReceiptItem(section, index, {
            ...item,
            label: editedLabel,
            quantity: editedQuantity
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        removeReceiptItem(section, index);
    };

    if (isEditing) {
        return (
            <div className="flex gap-2 mb-1 text-sm">
                <input
                    value={editedLabel}
                    onChange={(e) => setEditedLabel(e.target.value)}
                    className="flex-1 bg-slate-50 px-2 py-1 rounded border border-slate-300"
                />
                <input
                    value={editedQuantity}
                    onChange={(e) => setEditedQuantity(e.target.value)}
                    className="w-16 bg-slate-50 px-2 py-1 rounded border border-slate-300 text-right"
                />
                <button onClick={handleSave} className="text-green-600 hover:text-green-700">✓</button>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center group mb-1">
            <div className="flex-1 font-mono text-sm">
                {item.label}
                <span className="mx-2">{'.'}.repeat(Math.max(0, 30 - item.label.length))</span>
                <span className="float-right">{item.quantity}</span>
            </div>
            {item.editable && (
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                        ✎
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700 text-xs"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ReceiptDisplay() {
    const { receipt } = useReceiptStore();

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl font-mono max-w-md">
            <div className="border-4 border-double border-slate-800 p-6">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">LEARNING RECEIPT</h2>
                    <div className="text-xs space-y-1">
                        <div>Project: {receipt.title || 'Untitled'}</div>
                        <div>Date: {receipt.date}</div>
                        <div>Duration: {receipt.duration}</div>
                    </div>
                </div>

                {/* Skills Section */}
                {receipt.skills.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-bold text-sm mb-2 border-b border-slate-400">SKILLS ACQUIRED</h3>
                        {receipt.skills.map((item, index) => (
                            <ReceiptLineItem key={index} item={item} section="skills" index={index} />
                        ))}
                    </div>
                )}

                {/* Process Section */}
                {receipt.process.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-bold text-sm mb-2 border-b border-slate-400">PROCESS</h3>
                        {receipt.process.map((item, index) => (
                            <ReceiptLineItem key={index} item={item} section="process" index={index} />
                        ))}
                    </div>
                )}

                {/* Costs Section */}
                {receipt.costs.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-bold text-sm mb-2 border-b border-slate-400">COSTS</h3>
                        {receipt.costs.map((item, index) => (
                            <ReceiptLineItem key={index} item={item} section="costs" index={index} />
                        ))}
                    </div>
                )}

                {/* Total */}
                {receipt.total && (
                    <div className="border-t-2 border-slate-800 pt-4 mt-4">
                        <div className="text-sm">
                            <strong>TOTAL:</strong> {receipt.total}
                        </div>
                    </div>
                )}

                {/* Coupon */}
                {receipt.coupon && (
                    <div className="border-t-2 border-dashed border-slate-400 pt-4 mt-4">
                        <div className="text-xs">
                            <strong>COUPON:</strong> {receipt.coupon}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">(Expires: never)</div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs mt-6 border-t-2 border-slate-800 pt-4">
                    Thank you for learning!
                </div>
            </div>
        </div>
    );
}
