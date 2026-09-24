import { describe, expect, it } from 'vitest';
import type { ResumeData } from '../data/resume';
import type { Target } from '../data/site';
import {
	createHistory,
	findTarget,
	openAllMessage,
	runCommand,
	type CommandContext,
} from './terminal';

const targets: Target[] = [
	{ key: 'github', verb: 'open', href: 'https://github.com/x', external: true },
	{ key: 'linkedin', verb: 'open', href: 'https://linkedin.com/in/x', external: true },
	{ key: 'email', verb: 'open', href: 'mailto:a@b.co' },
	{ key: 'projects', verb: 'cd', href: '/projects' },
	{ key: 'experience', verb: 'cd', href: '/experience' },
];

const resume: ResumeData = { name: 'N', contact: 'c', summary: 's', sections: [] };
const ctx: CommandContext = { targets, resume };

describe('runCommand', () => {
	it('ignores blank input', () => {
		expect(runCommand('', ctx)).toEqual({ lines: [] });
		expect(runCommand('   ', ctx)).toEqual({ lines: [] });
	});

	it('echoes the trimmed command and collapses inner whitespace for parsing', () => {
		const { lines } = runCommand('  cd    projects ', ctx);
		expect(lines).toEqual(['$ cd    projects']);
	});

	it('help lists the commands', () => {
		expect(runCommand('help', ctx).lines).toEqual([
			'$ help',
			'commands: ls, cd <page>, open <link|all>, cat resume, help',
		]);
	});

	it('ls lists every target plus resume', () => {
		expect(runCommand('ls', ctx).lines[1]).toBe(
			'github  linkedin  email  projects  experience  resume',
		);
	});

	describe('cat', () => {
		it.each(['cat resume', 'cat ./resume', 'cat /resume'])('%s prints the resume', (cmd) => {
			expect(runCommand(cmd, ctx).action).toEqual({ type: 'print-resume' });
		});

		it('reports a missing operand', () => {
			expect(runCommand('cat', ctx).lines[1]).toBe('cat: missing operand: No such file');
		});

		it('reports an unknown file', () => {
			expect(runCommand('cat nope', ctx).lines[1]).toBe('cat: nope: No such file');
		});

		it('reports resume as missing when there is no resume data', () => {
			const result = runCommand('cat resume', { targets, resume: null });
			expect(result.action).toBeUndefined();
			expect(result.lines[1]).toBe('cat: resume: No such file');
		});
	});

	describe('cd', () => {
		it.each(['cd', 'cd ~', 'cd home'])('%s goes home', (cmd) => {
			expect(runCommand(cmd, ctx).action).toEqual({ type: 'navigate', href: '/' });
		});

		it('navigates to a known page', () => {
			expect(runCommand('cd projects', ctx).action).toEqual({
				type: 'navigate',
				href: '/projects',
			});
		});

		it('reports an unknown page', () => {
			expect(runCommand('cd nowhere', ctx).lines[1]).toBe('cd: no such page: nowhere');
		});

		it('does not cd into an open-verb link', () => {
			const result = runCommand('cd github', ctx);
			expect(result.action).toBeUndefined();
			expect(result.lines[1]).toBe('cd: no such page: github');
		});
	});

	describe('open', () => {
		it('opens external links in a new window', () => {
			expect(runCommand('open github', ctx).action).toEqual({
				type: 'open',
				href: 'https://github.com/x',
			});
		});

		it('navigates for non-external links such as mailto', () => {
			expect(runCommand('open email', ctx).action).toEqual({
				type: 'navigate',
				href: 'mailto:a@b.co',
			});
		});

		it('reports an unknown link, including a bare open', () => {
			expect(runCommand('open nope', ctx).lines[1]).toBe('open: no such link: nope');
			expect(runCommand('open', ctx).lines[1]).toBe('open: no such link: ');
		});

		it('does not open a cd-verb page', () => {
			const result = runCommand('open projects', ctx);
			expect(result.action).toBeUndefined();
			expect(result.lines[1]).toBe('open: no such link: projects');
		});

		it('open all returns only the open-verb targets', () => {
			const result = runCommand('open all', ctx);
			expect(result.action).toEqual({ type: 'open-all', targets: targets.slice(0, 3) });
		});
	});

	it('reports unknown commands, case-sensitively', () => {
		expect(runCommand('nope', ctx).lines[1]).toBe('command not found: nope');
		expect(runCommand('HELP', ctx).lines[1]).toBe('command not found: HELP');
	});
});

describe('findTarget', () => {
	it('matches on both verb and key', () => {
		expect(findTarget(targets, 'cd', 'projects')?.href).toBe('/projects');
		expect(findTarget(targets, 'open', 'projects')).toBeUndefined();
	});
});

describe('openAllMessage', () => {
	const opens = targets.slice(0, 3);

	it('lists the keys when nothing was blocked', () => {
		expect(openAllMessage(opens, 0)).toBe('opened 3 links: github, linkedin, email');
	});

	it('reports blocked pop-ups', () => {
		expect(openAllMessage(opens, 2)).toBe(
			"opened 1/3 links (2 blocked by your browser's pop-up blocker)",
		);
	});
});

describe('createHistory', () => {
	it('walks back through entries and stops at the oldest', () => {
		const h = createHistory();
		h.push('a');
		h.push('b');
		expect(h.up()).toBe('b');
		expect(h.up()).toBe('a');
		expect(h.up()).toBeNull();
	});

	it('walks forward and clears once past the newest', () => {
		const h = createHistory();
		h.push('a');
		h.push('b');
		h.up();
		h.up();
		expect(h.down()).toBe('b');
		expect(h.down()).toBe('');
		expect(h.down()).toBe('');
	});

	it('returns null on up with an empty history', () => {
		expect(createHistory().up()).toBeNull();
	});

	it('ignores blank input but still resets navigation, and keeps duplicates', () => {
		const h = createHistory();
		h.push(' a ');
		h.push('a');
		h.up();
		h.push('   ');
		expect(h.up()).toBe('a');
		expect(h.up()).toBe('a');
		expect(h.up()).toBeNull();
	});
});
