'use client'

import React, { useState } from 'react';
import { styled } from '@/utils/tw';
import { VibeGen } from './VibeGen';
import EmojiPicker from 'emoji-picker-react';
import { Smile, ImageIcon } from 'lucide-react';


const Container = styled.div`min-h-screen flex flex-col items-center justify-center bg-stone-deep px-4 py-20`;
const Title = styled.h1`display text-5xl md:text-7xl text-center select-none transition-colors duration-200 hover:text-pink hover:italic`;
const Input = styled.input`field w-72 md:w-96`;
const Button = styled.button`pebble-btn mt-6 px-10`;

export default function VibePage() {
	const [input, setInput] = useState("");
	const [vibe, setVibe] = useState("");
	const [type, setType] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const titleText = 'JUST TELL ME HOW YOU WANT TO FEEL'

	return (
		<Container>
			<div className="grid grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2 mb-14 gap-x-4 gap-y-1 md:gap-x-8 md:gap-y-2">
				{titleText.split(' ').map((word, i) => (
					<Title key={i}>{word}</Title>
				))}
			</div>

			<div className='flex flex-col items-center'>

				<div className='flex flex-wrap justify-center gap-2 items-center'>
					<div className=''>
						<Input type="text" value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='an adventurer, empowered, a morning breeze...'
						/>
					</div>

					<button onClick={() => setShowEmojiPicker(!showEmojiPicker)} aria-label="Add emoji" className="knead w-12 h-12 flex items-center justify-center bg-paper/60 hover:bg-paper rounded-full relative cursor-pointer">
						<Smile className="w-6 h-6" />
					</button>

					{showEmojiPicker && <div className='fixed top-0 left-0 w-full h-full z-50 bg-ink/40 backdrop-blur-sm' onClick={() => setShowEmojiPicker(false)} />}
					<div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
							<EmojiPicker open={showEmojiPicker} onEmojiClick={emoji => setInput(input + emoji.emoji)} previewConfig={{ showPreview: false }} />
						</div>

					<div className="">
						<label htmlFor="imageUpload" className="pebble-btn-soft">
							<ImageIcon className="w-4 h-4" />
							Upload Image
						</label>
						<input
							id="imageUpload"
							type="file"
							accept="image/*"
							className="hidden"
							onChange={async (e) => {
								const file = e.target.files?.[0];
								if (file) {
									const reader = new FileReader();
									reader.onload = (e) => {
										const base64 = e.target?.result;
										if (typeof base64 === 'string') {
											setInput('');
											setVibe(base64);
											setType('image');
										}
									};
									reader.readAsDataURL(file);
								}
							}}
						/>
					</div>
				</div>

				{((vibe != input) || (input == '')) && <Button onClick={
					() => {
						setVibe(input);
						setType('text');
					}
				}>Go</Button>}
			</div>

			<VibeGen vibe={vibe} type={type} />
		</Container>
	);
}