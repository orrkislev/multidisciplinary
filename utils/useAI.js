import { experimental_useObject as useObject } from 'ai/react';
import { descriptionSchema, namesSchema, projectsSchema, terminologySchema } from './Schema';
import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { object } from 'zod';


export const useSubjects = create((set) => ({
    subject1: null,
    subject2: null,
    setSubjects: (subject1, subject2) => set({ subject1, subject2 })
}));

export const useAiData = create((set) => ({
    name: null,
    names: null,
    description: null,
    projects: null,
    terminology: null,
    setName: (name) => set({ name }),
    setNames: (names) => set({ names }),
    setDescription: (description) => set({ description }),
    setProjects: (projects) => set({ projects }),
    setTerminology: (terminology) => set({ terminology }),
}));

export default function useAIManager() {
    const { subject1, subject2 } = useSubjects();
    const { name, names, description, projects, terminology, setName, setNames, setDescription, setProjects, setTerminology } = useAiData();
    const get_names = useObjectZustand({ api: '/api/name', schema: namesSchema, onUpdate: (object) => setNames(object?.subjects) });
    const get_description = useObjectZustand({ api: '/api/name', schema: descriptionSchema, onUpdate: setDescription });
    const get_projects = useObjectZustand({ api: '/api/name', schema: projectsSchema, onUpdate: (object) => setProjects(object?.projects) });
    const get_terms = useObjectZustand({ api: '/api/name', schema: terminologySchema, onUpdate: setTerminology });

    useEffect(() => {
        if (subject1 && subject2) {
            console.log(`got subjects: ${subject1} and ${subject2}, submitting names`);
            get_names.submit({ action: 'name', subject1, subject2 });
        } else {
            setNames(null);
            setNames(null);
            setDescription(null);
            setProjects(null);
            setTerminology(null);
            get_names.reset();
            get_description.reset();
            get_projects.reset();
            get_terms.reset();
        }
    }, [subject1, subject2])

    useEffect(() => {
        if (!names) return;
        console.log(`got names: ${names}`);
        setName(names[0]);
    }, [get_names.finished])

    useEffect(()=>{
        if (!name) return;
        console.log(`new name is: ${name}`);
        get_description.submit({ action: 'description', subject1, subject2, name });
        get_projects.submit({ action: 'projects', subject1, subject2, name });
    },[name])

    useEffect(() => {
        if (!description) return;
        console.log('got description',description);
        get_terms.submit({ action: 'terms', subject1, subject2, name, description: description[0] });
    }, [get_description.finished])

    useEffect(() => {
        if (!projects) return
        console.log(`got projects: ${projects}`);
    }, [get_projects.finished])

    useEffect(() => {
        if (!terminology) return
        console.log(`got terminology: ${terminology}`);
    }, [get_terms.finished])
}





function useObjectZustand({ api, schema, onUpdate }) {
    const [finished, setFinished] = useState(false);
    const { object, submit } = useObject({
        api, schema, onFinish({ object, error }) {
            setFinished(true)
        }
    })
    useEffect(() => {
        if (object) onUpdate(object)
    }, [object])
    const reset = () => {
        onUpdate(null)
        setFinished(false)
    }
    return { object, submit, finished, reset }
}