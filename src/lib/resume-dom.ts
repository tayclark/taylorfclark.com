import type { ResumeData, ResumeEntry } from '../data/resume';
import { el } from './dom';

function buildEntry(entry: ResumeEntry): HTMLElement[] {
	const nodes: HTMLElement[] = [
		el('div', 'r-role-line', undefined, [
			el('span', undefined, entry.org ? `${entry.role} — ${entry.org}` : entry.role),
			el('span', 'r-dates', entry.dates),
		]),
	];
	if (entry.blurb) nodes.push(el('div', 'r-blurb', entry.blurb));
	if (entry.bullets.length) {
		nodes.push(
			el(
				'ul',
				'r-bullets',
				undefined,
				entry.bullets.map((bullet) => el('li', undefined, bullet)),
			),
		);
	}
	if (entry.tech) nodes.push(el('div', 'r-tech', `Technologies: ${entry.tech}`));
	return nodes;
}

export function buildResume(data: ResumeData): HTMLElement {
	return el('div', 'block resume', undefined, [
		el('div', 'r-name', data.name),
		el('div', 'r-contact', data.contact),
		el('p', 'r-summary', data.summary),
		...data.sections.flatMap((section) => [
			el('div', 'r-heading', section.title),
			...section.entries.flatMap(buildEntry),
		]),
	]);
}
