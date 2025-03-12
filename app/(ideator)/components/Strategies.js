import { useIdeator } from "./useIdeatorAI"
import { isHebrew } from "@/utils/utils";

export default function Strategies() {
    const strategies = useIdeator(state => state.strategies);

    const showStrategies = Array.isArray(strategies) && strategies.length > 0;

    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-300 p-2 px-4 rounded-lg flex flex-col gap-8 justify-between text-sm">
            {showStrategies && strategies.map((strategy, i) => {
                const hasHebrewContent = isHebrew(strategy.title) || isHebrew(strategy.task);
                return (
                    <div key={i} className={`flex-1 flex flex-col ${hasHebrewContent ? 'rtl text-right' : ''}`}>
                        <h3 className="font-bold">{strategy.title}</h3>
                        <p>{strategy.task}</p>
                    </div>
                );
            })}
        </div>
    )
}