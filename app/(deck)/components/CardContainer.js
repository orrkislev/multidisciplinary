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
            width: "60vw",
            height: "50vw",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            scale: 1,
        },
        hand_exit: {
            y: '300%',
        },
        selected_exit: {
            x: '300%',
        },
    };

    return (
        <motion.div
            layout
            onClick={!selected ? onClick : undefined}
            initial="hand"
            animate={selected ? "selected" : "hand"}
            exit={selected ? "selected_exit" : "hand_exit"}
            variants={variants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between overflow-hidden hover:z-10 p-1 ${selected ? 'cursor-default' : 'cursor-pointer'}`}
            style={{ zIndex: selected ? 100 : 0 }}
        >
            {children}
        </motion.div>
    );
}
