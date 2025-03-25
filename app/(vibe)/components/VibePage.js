'use client'

import React, { useState } from 'react';
import { styled } from '@/utils/tw';
import { VibeGen } from './VibeGen';
import EmojiPicker from 'emoji-picker-react';
import { Smile, ImageIcon } from 'lucide-react';


const Container = styled.div`min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-16`;
const Title = styled.h1`text-4xl md:text-6xl text-gray-800 uppercase text-center select-none font-magilio`;
const Input = styled.input`p-2 focus:outline-none w-80 font-geist border border-gray-500 rounded-full bg-transparent font-geist`;
const Button = styled.button`bg-gray-500 text-white font-bold py-2 px-8 rounded-full hover:bg-gray-800 transition mt-4 font-geist`;

export default function VibePage() {
	const [input, setInput] = useState("");
	const [vibe, setVibe] = useState("");
	const [type, setType] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const titleText = 'JUST TELL ME HOW YOU WANT TO FEEL'

	return (
		<Container>
			<div className="grid grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2 mb-16 gap-2 md:gap-8">
				{titleText.split(' ').map((word, i) => (
					<Title key={i}>{word}</Title>
				))}
			</div>

			<div className='flex flex-col items-center'>

				<div className='flex gap-2 items-center'>
					<div className=''>
						<Input type="text" value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='an adventurer, empowered, a morning breeze...'
						/>
					</div>

					<button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-gray-100 rounded-full relative">
						<Smile className="w-8 h-8 text-gray-500 hover:text-orange-500 transition" />
					</button>

					{showEmojiPicker && <div className='fixed top-0 left-0 w-full h-full z-50 bg-black opacity-50' onClick={() => setShowEmojiPicker(false)} />}
					<div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
							<EmojiPicker open={showEmojiPicker} onEmojiClick={emoji => setInput(input + emoji.emoji)} previewConfig={{ showPreview: false }} />
						</div>

					<div className="">
						<label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 text-gray-800 py-2 px-8 rounded-full hover:bg-gray-800 hover:text-white transition font-geist flex items-center gap-2">
							<ImageIcon className="w-5 h-5" />
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
				}>GO</Button>}
			</div>

			<VibeGen vibe={vibe} type={type} />
		</Container>
	);
}