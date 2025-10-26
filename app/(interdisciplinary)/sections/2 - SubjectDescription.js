import { TrendingUp } from "lucide-react";
import { useData } from "../utils/store";

export default function SubjectDescription() {
    const currentMerge = useData(state => state.getActiveMerge());
    const description = currentMerge?.description;

    let desc = {
        title: 'Interdisciplinary Fusion',
        subtitle: 'Merging Ideas for Innovation',
        description: 'This app fuses two subjects, chosen from a list or via search, to form a unique interdisciplinary discipline. It generates a concise Wikipedia-style overview, highlights key terms and concepts, poses intriguing research questions, outlines historical and future trends, and suggests beginner projects.',
        emergingTrends: ['Generate serendipity', 'Inspire exploration', 'Fuel creativity'],
        funFact: 'Did you know? Fusion of ideas sparks breakthrough innovations!',
        goals: 'Goals',
    }

    if (description) {
        desc = description;
        desc.goals = 'Emerging Trends';
    }


    return (
        <div className="flex justify-between gap-8">
            <div className='flex flex-col justify-between gap-8'>
                <div id="subject-description" className="card flex flex-col gap-2">
                    <h2 className="card-title">{desc.title}</h2>
                    <h3 className="card-subtitle">{desc.subtitle}</h3>
                    <p className="card-description">{desc.description}</p>
                </div>

                <div id="emerging-trends" className="card">
                    <h3 className="card-title flex gap-2 items-center">
                        <TrendingUp className="w-4 h-4" />
                        {desc.goals}
                    </h3>
                    <ul className="list-disc list-inside">
                        {desc.emergingTrends.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

            </div>
            <div id="fun-fact" className="card flex items-center justify-center">
                <p className="italic font-sans text-center">{desc.funFact}</p>
            </div>
        </div>
    )
}
