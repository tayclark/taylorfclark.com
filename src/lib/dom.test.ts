// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { el } from './dom';

describe('el', () => {
	it('creates a bare element by default', () => {
		const node = el('div');
		expect(node.tagName).toBe('DIV');
		expect(node.className).toBe('');
		expect(node.childNodes).toHaveLength(0);
	});

	it('sets class name and text content', () => {
		const node = el('span', 'label', 'hello');
		expect(node.className).toBe('label');
		expect(node.textContent).toBe('hello');
	});

	it('applies empty-string text but skips an undefined one', () => {
		const child = el('i', undefined, 'kept');
		expect(el('p', undefined, '', [child]).textContent).toBe('kept');
		expect(el('p', undefined, undefined, [child]).textContent).toBe('kept');
	});

	it('appends children in order', () => {
		const node = el('ul', undefined, undefined, [
			el('li', undefined, 'a'),
			el('li', undefined, 'b'),
		]);
		expect([...node.children].map((c) => c.textContent)).toEqual(['a', 'b']);
	});
});
