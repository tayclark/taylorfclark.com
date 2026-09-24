// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import type { ResumeData } from '../data/resume';
import { buildResume } from './resume-dom';

const data: ResumeData = {
	name: 'Jane Doe',
	contact: 'jane@example.com',
	summary: 'Engineer.',
	sections: [
		{
			title: 'Experience',
			entries: [
				{
					role: 'Lead',
					org: 'Acme',
					dates: '2020–2024',
					blurb: 'Ran things.',
					bullets: ['Shipped A', 'Shipped B'],
					tech: 'Node, AWS',
				},
			],
		},
		{
			title: 'Projects',
			entries: [{ role: 'Side project', org: '', dates: '2025', bullets: [], tech: '' }],
		},
	],
};

describe('buildResume', () => {
	const root = buildResume(data);
	const text = (selector: string) => [...root.querySelectorAll(selector)].map((n) => n.textContent);

	it('renders header fields', () => {
		expect(root.className).toBe('block resume');
		expect(text('.r-name')).toEqual(['Jane Doe']);
		expect(text('.r-contact')).toEqual(['jane@example.com']);
		expect(text('.r-summary')).toEqual(['Engineer.']);
	});

	it('renders a heading per section', () => {
		expect(text('.r-heading')).toEqual(['Experience', 'Projects']);
	});

	it('renders a full entry', () => {
		expect(text('.r-role-line span:first-child')).toContain('Lead — Acme');
		expect(text('.r-dates')).toEqual(['2020–2024', '2025']);
		expect(text('.r-blurb')).toEqual(['Ran things.']);
		expect(text('.r-bullets li')).toEqual(['Shipped A', 'Shipped B']);
		expect(text('.r-tech')).toEqual(['Technologies: Node, AWS']);
	});

	it('omits org, blurb, bullets and tech when absent', () => {
		expect(text('.r-role-line span:first-child')).toContain('Side project');
		expect(root.querySelectorAll('.r-blurb')).toHaveLength(1);
		expect(root.querySelectorAll('.r-bullets')).toHaveLength(1);
		expect(root.querySelectorAll('.r-tech')).toHaveLength(1);
	});
});
