"use client";
import { motion } from 'framer-motion';

export default function CardContainer({ index, onClick, selected, cardsInHand, children }) {
    const fanAngle = 60;
    const angleIncrement = cardsInHand > 1 ? fanAngle / (cardsInHand - 1) : 0;
    const rotate = -fanAngle / 2 + index * angleIncrement;

    const variants = {
        hand: {
            rotate: rotate,
            width: "150px",
            height: "210px",
            bottom: "2em",
            left: "50%",
            x: (index - cardsInHand / 2) * 100 + '%',
            y: -10 + Math.abs(((cardsInHand - 1) / 2 - index)) * 10 + '%',
            scale: 1,
        },
        selected: {
            rotate: 0,
            width: "50vw",
            height: "auto",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            scale: 1,
        },
    };

    return (
        <motion.div
            layout
            onClick={!selected ? onClick : undefined}
            initial="hand"
            animate={selected ? "selected" : "hand"}
            variants={variants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col cursor-pointer overflow-hidden hover:z-10 p-1"
        >
            {children}
        </motion.div>
    );
}
