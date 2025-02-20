import { Josefin_Sans, Unna } from 'next/font/google'

export const jose = Josefin_Sans({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-jose',
})

export const unna = Unna({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-unna',
})
