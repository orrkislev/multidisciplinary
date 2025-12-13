export const initialWords = [
    {
        text: 'what', interventions: [
            {
                type: 'question',
                options: [
                    "Lets define your project better",
                ],
                wordStart: 0,
                wordEnd: 0
            }
        ]
    },
    { text: 'are', interventions: [] },
    { text: 'you', interventions: [] },
    {
        text: 'working', interventions: [
            {
                type: 'replacement',
                options: [
                    "making",
                    "developing",
                    "doing",
                    "creating",
                    "building"
                ],
                wordStart: 3,
                wordEnd: 3
            }
        ]
    },
    {
        text: 'on?', interventions: [
            {
                type: 'insertion',
                options: [
                    "Clear this text",
                    "Replace with your project",
                    "the AI will help refine it"
                ],
                position: 4
            }
        ]
    }
]