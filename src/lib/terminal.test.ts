import { describe, expect, it } from 'vitest';
import type { ResumeData } from '../data/resume';
import type { Target } from '../data/site';
import {
	COMMANDS,
	complete,
	createHistory,
	findTarget,
	openAllMessage,
	runCommand,
	suggestions,
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

describe('complete', () => {
	it('leaves blank input alone', () => {
		expect(complete('', ctx)).toEqual({ value: '', candidates: [] });
		expect(complete('   ', ctx)).toEqual({ value: '   ', candidates: [] });
	});

	it('completes a unique verb prefix with a trailing space', () => {
		expect(complete('he', ctx)).toEqual({ value: 'help ', candidates: [] });
		expect(complete('  ca', ctx)).toEqual({ value: 'cat ', candidates: [] });
	});

	it('leaves an unknown verb prefix alone', () => {
		expect(complete('zz', ctx)).toEqual({ value: 'zz', candidates: [] });
	});

	it('lists candidates for an ambiguous verb prefix', () => {
		const verbs = COMMANDS.filter((c) => c.startsWith('c'));
		expect(complete('c', ctx)).toEqual({ value: 'c', candidates: verbs });
	});

	it('completes cd arguments from cd targets and home', () => {
		expect(complete('cd pr', ctx)).toEqual({ value: 'cd projects', candidates: [] });
		expect(complete('cd ho', ctx)).toEqual({ value: 'cd home', candidates: [] });
		expect(complete('cd ', ctx).candidates).toEqual(['projects', 'experience', 'home']);
	});

	it('completes open arguments from open targets and all', () => {
		expect(complete('open al', ctx)).toEqual({ value: 'open all', candidates: [] });
		expect(complete('open git', ctx).value).toBe('open github');
	});

	it('extends to the common prefix when several arguments match', () => {
		const many: CommandContext = {
			resume: null,
			targets: [
				{ key: 'alpha', verb: 'open', href: '/a' },
				{ key: 'alpine', verb: 'open', href: '/b' },
			],
		};
		expect(complete('open a', many)).toEqual({
			value: 'open al',
			candidates: ['alpha', 'alpine', 'all'],
		});
	});

	it('completes cat resume only when resume data exists', () => {
		expect(complete('cat re', ctx).value).toBe('cat resume');
		expect(complete('cat re', { targets, resume: null })).toEqual({
			value: 'cat re',
			candidates: [],
		});
	});

	it('does nothing for verbs without arguments or extra words', () => {
		expect(complete('help ', ctx)).toEqual({ value: 'help ', candidates: [] });
		expect(complete('cd projects x', ctx)).toEqual({
			value: 'cd projects x',
			candidates: [],
		});
	});
});

describe('suggestions', () => {
	it('offers help, ls, cat resume, then every target', () => {
		expect(suggestions(ctx)).toEqual([
			'help',
			'ls',
			'cat resume',
			'open github',
			'open linkedin',
			'open email',
			'cd projects',
			'cd experience',
		]);
	});

	it('omits cat resume without resume data', () => {
		expect(suggestions({ targets: [], resume: null })).toEqual(['help', 'ls']);
	});
});
