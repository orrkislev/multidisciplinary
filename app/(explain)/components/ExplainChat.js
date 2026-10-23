import { useEffect, useRef, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { aiSchemas } from '@/utils/Schema';
import { Send } from 'lucide-react';

const PORTRAIT_STYLE = 'Head-and-shoulders portrait facing the viewer, centered. Antique engraved portrait, fine black ink cross-hatching on warm cream paper, with a single hot pink accent. No text, no letters, no frame.';

export function ExplainChat({ character, ready, subject }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [understanding, setUnderstanding] = useState(null);
    const portrait = usePortrait(character, ready);
    const listRef = useRef(null);

    const chat = useObject({
        api: '/api/chat',
        schema: aiSchemas.chat,
        onFinish: ({ object }) => {
            if (!object) return
            setMessages(m => [...m, { role: 'assistant', content: object.text }])
            setUnderstanding(object.understanding)
        }
    });

    const send = (history) => {
        setMessages(history)
        chat.submit({ messages: history, character, subject })
    }

    // the conversation opens once the character is fully known
    useEffect(() => {
        if (ready) send([{ role: 'user', content: `I can explain the concept of "${subject}"` }])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);

    const replying = chat.isLoading;
    const partial = replying ? chat.object?.text : null;

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, [messages.length, partial]);

    const submit = () => {
        if (!input.trim() || replying || !ready) return
        send([...messages, { role: 'user', content: input.trim() }])
        setInput('')
    }

    // the opening line is ours, not the user's, so it stays out of the transcript
    const shown = messages.slice(1);
    const live = replying ? (chat.object?.understanding ?? understanding) : understanding;

    return (
        <div className="h-dvh flex flex-col md:flex-row gap-4 md:gap-6 justify-center bg-stone-deep p-4 md:p-6">
            <header className="md:w-80 shrink-0 paper p-6 flex flex-col items-center text-center md:self-start md:max-h-full md:overflow-y-auto">
                <Avatar src={portrait} size="w-32 h-32 md:w-36 md:h-36" />
                <h1 className="display text-3xl mt-4 min-h-[1em]">
                    {character?.name || <span className="shimmer inline-block w-56">Finding someone</span>}
                </h1>
                {character?.title && (
                    <p className="text-ink-soft mt-1">{character.title}{character.year ? `, ${character.year}` : ''}</p>
                )}
                {character?.description && <p className="text-sm text-ink-soft mt-3 leading-relaxed">{character.description}</p>}
                {live !== null && live !== undefined && <UnderstandingMeter value={live} />}
            </header>

            <div className="w-full md:max-w-2xl flex-1 min-h-0 paper flex flex-col overflow-hidden">
                <div ref={listRef} className="flex-1 overflow-y-auto flex flex-col p-5">
                    {/* mt-auto keeps the conversation sitting on the input, like a chat app */}
                    <div className="mt-auto flex flex-col gap-4">
                        {shown.map((m, i) => <Message key={i} role={m.role} portrait={portrait}>{m.content}</Message>)}
                        {(replying || !ready) && (
                            <Message role="assistant" portrait={portrait}>
                                {partial || <Typing />}
                            </Message>
                        )}
                    </div>
                </div>
                <div className="p-3 flex gap-2 items-end border-t border-ink/10">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
                        rows={1}
                        className="field !rounded-[1.25rem] flex-1 resize-none"
                        placeholder={ready ? 'Your answer' : 'Waiting for them to arrive…'}
                        disabled={!ready}
                    />
                    <button onClick={submit} disabled={!input.trim() || replying || !ready} aria-label="Send" className="pebble-btn !px-0 w-12 h-12">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Message({ role, portrait, children }) {
    if (role === 'user') {
        return (
            <div className="self-end max-w-[80%] rounded-[1.25rem_1.25rem_0.4rem_1.25rem] bg-ink text-paper px-4 py-2.5 leading-relaxed animate-fade-in">
                {children}
            </div>
        )
    }
    return (
        <div className="self-start max-w-[85%] flex items-end gap-2.5 animate-fade-in">
            <Avatar src={portrait} size="w-9 h-9 shrink-0" />
            <div className="rounded-[1.25rem_1.25rem_1.25rem_0.4rem] bg-stone-pale px-4 py-2.5 leading-relaxed">{children}</div>
        </div>
    )
}

function Avatar({ src, size }) {
    return src
        ? <img src={src} alt="" className={`${size} rounded-full object-cover shadow-[0_0_0_2px_#FAF9F7,0_0_0_3.5px_#FF2D87]`} />
        : <div className={`${size} rounded-full shimmer !rounded-full`} />
}

function Typing() {
    return (
        <span className="flex gap-1 py-1.5" aria-label="Typing">
            {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-ink-soft animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
        </span>
    )
}

function usePortrait(character, ready) {
    const [src, setSrc] = useState(null);
    useEffect(() => {
        if (!ready || !character) return
        let alive = true
        fetch('/api/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `Portrait of ${character.name}, ${character.title} (${character.year}). ${character.physical} ${character.scenario}. ${PORTRAIT_STYLE}`,
                aspectRatio: '1:1',
            }),
        })
            .then(r => r.json())
            .then(j => alive && j.image && setSrc(`data:${j.mimeType};base64,${j.image}`))
            .catch(() => { })
        return () => { alive = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);
    return src;
}

// value is between -10 and 10
function UnderstandingMeter({ value }) {
    const v = (Math.max(-10, Math.min(10, value)) + 10) / 20;
    return (
        <div className="mt-4 w-48 h-2 bg-paper rounded-full overflow-hidden" title="How well they understand" style={{ boxShadow: 'inset 0 0 0 1px rgb(36 32 30 / 0.12)' }}>
            <div className="h-full bg-pink rounded-full transition-all duration-1000 ease-squish" style={{ width: `${v * 100}%` }} />
        </div>
    )
}
