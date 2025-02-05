'use client'

import React, { useState } from 'react';
import { styled } from '@/utils/tw';

import { VibeGen } from './VibeGen';


// Styled components using Tailwind classes
const Container = styled.div`min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-16`;
const Title = styled.h1`text-4xl md:text-6xl text-gray-800 uppercase text-center select-none font-magilio`;
const Form = styled.form`flex flex-col items-center`;
const Input = styled.input`border border-gray-500 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 font-geist`;
const Button = styled.button`bg-gray-500 text-white font-bold py-2 px-8 rounded-full hover:bg-gray-800 transition mt-4 font-geist`;

export default function VibePage() {
	const [input, setInput] = useState("");
	const [vibe, setVibe] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setVibe(input);
	};

	const titleText = 'JUST TELL ME HOW YOU WANT TO FEEL'

	return (
		<Container>
			<div className="grid grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2 mb-16 gap-2 md:gap-8">
				{titleText.split(' ').map((word, i) => (
					<Title key={i}>{word}</Title>
				))}
			</div>

			<Form onSubmit={handleSubmit}>
				<div className='font-geist italic text-blue-800 text-sm select-none'>I would like to feel like..</div>
				<Input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='an adventurer, empowered, a morning breeze...'
				/>
				{((vibe != input) || (input == '')) && <Button type="submit">GO</Button>}
			</Form>

			<VibeGen vibe={vibe} />
		</Container>
	);
}