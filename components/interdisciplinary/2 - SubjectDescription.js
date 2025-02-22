import { aiConfig, useUserData } from "@/utils/ai-config";

export default function SubjectDescription() {
    const { subject1, subject2 } = useUserData();
    const description = aiConfig.description.store((state) => state.data);

    let desc = {
        title: 'Interdisciplinary Fusion',
        subtitle: 'Merging Ideas for Innovation',
        description: 'This app fuses two subjects, chosen from a list or via search, to form a unique interdisciplinary discipline. It generates a concise Wikipedia-style overview, highlights key terms and concepts, poses intriguing research questions, outlines historical and future trends, and suggests beginner projects.',
        emergingTrends: ['Generate serendipity', 'Inspire exploration', 'Fuel creativity'],
        funFact: 'Did you know? Fusion of ideas sparks breakthrough innovations!',
        goals: 'Goals',
    }
    if (subject1 && subject2) desc = { title: '', subtitle: '', description: '', emergingTrends: [], funFact: '', goals: '' };
    if (description) {
        desc = description;
        desc.goals = 'Emerging Trends';
    }

    if (!Array.isArray(desc.emergingTrends)) {
        desc.emergingTrends = [];
    }

    return (
        <>
            <div className='flex flex-col md:flex-row justify-between gap-8'>
                <div className="rounded-lg">
                    <h2 className="text-2xl font-bold">{desc.title}</h2>
                    <h3 className="text-lg font-bold">{desc.subtitle}</h3>
                    <p className="text-lg text-gray-800">{desc.description}</p>

                    <div className="mt-4">
                        <h3 className="text-lg font-bold">{desc.goals}</h3>
                        <ul className="list-disc list-inside text-gray-800">
                            {desc.emergingTrends.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="hidden md:flex rounded-lg border-white border-2 p-2 items-center justify-center">
                    <p className="text-gray-800 italic font-sans text-center text-orange-800">{desc.funFact}</p>
                </div>
            </div>
            {/* Fun fact for mobile */}
            <div className="md:hidden mt-4">
                <p className="text-gray-800 italic font-sans text-center text-orange-800">{desc.funFact}</p>
            </div>
        </>
    )
}
