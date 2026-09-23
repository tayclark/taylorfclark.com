import type { ResumeData } from '../data/resume';

export interface Target {
	key: string;
	verb: 'open' | 'cd';
	href: string;
	external?: boolean;
}

export type TerminalAction =
	| { type: 'print-resume' }
	| { type: 'navigate'; href: string }
	| { type: 'open'; href: string }
	| { type: 'open-all'; targets: Target[] };

export interface CommandResult {
	/** Lines to print, in order, before the action (if any) is performed. */
	lines: string[];
	action?: TerminalAction;
}

export interface CommandContext {
	targets: Target[];
	resume: ResumeData | null;
}

export function findTarget(targets: Target[], verb: Target['verb'], key: string) {
	return targets.find((t) => t.verb === verb && t.key === key);
}

/** Message printed after `open all` once the caller knows how many pop-ups were blocked. */
export function openAllMessage(targets: Target[], blocked: number) {
	if (blocked > 0) {
		return `opened ${targets.length - blocked}/${targets.length} links (${blocked} blocked by your browser's pop-up blocker)`;
	}
	return `opened ${targets.length} links: ${targets.map((t) => t.key).join(', ')}`;
}

export function runCommand(raw: string, { targets, resume }: CommandContext): CommandResult {
	const cmd = raw.trim();
	if (!cmd) return { lines: [] };
	const echo = `$ ${cmd}`;

	const [verb, ...rest] = cmd.split(/\s+/);
	const arg = rest.join(' ');

	if (verb === 'help') {
		return { lines: [echo, 'commands: ls, cd <page>, open <link|all>, cat resume, help'] };
	}

	if (verb === 'ls') {
		return { lines: [echo, [...targets.map((t) => t.key), 'resume'].join('  ')] };
	}

	if (verb === 'cat') {
		const name = arg.replace(/^\.?\/?/, '');
		if (name === 'resume' && resume) {
			return { lines: [echo], action: { type: 'print-resume' } };
		}
		return { lines: [echo, `cat: ${arg || 'missing operand'}: No such file`] };
	}

	if (verb === 'cd') {
		if (arg === '~' || arg === 'home' || arg === '') {
			return { lines: [echo], action: { type: 'navigate', href: '/' } };
		}
		const target = findTarget(targets, 'cd', arg);
		if (target) {
			return { lines: [echo], action: { type: 'navigate', href: target.href } };
		}
		return { lines: [echo, `cd: no such page: ${arg}`] };
	}

	if (verb === 'open') {
		if (arg === 'all') {
			const openables = targets.filter((t) => t.verb === 'open');
			return { lines: [echo], action: { type: 'open-all', targets: openables } };
		}
		const target = findTarget(targets, 'open', arg);
		if (target) {
			return {
				lines: [echo],
				action: target.external
					? { type: 'open', href: target.href }
					: { type: 'navigate', href: target.href },
			};
		}
		return { lines: [echo, `open: no such link: ${arg}`] };
	}

	return { lines: [echo, `command not found: ${verb}`] };
}

export interface History {
	/** Record a submitted command (blank input is ignored) and reset navigation. */
	push(value: string): void;
	/** Older entry, or `null` when already at the oldest. */
	up(): string | null;
	/** Newer entry, or `''` (cleared input) once past the newest. */
	down(): string;
}

export function createHistory(): History {
	const entries: string[] = [];
	let index = -1;

	return {
		push(value) {
			const trimmed = value.trim();
			if (trimmed) entries.push(trimmed);
			index = entries.length;
		},
		up() {
			if (index <= 0) return null;
			index -= 1;
			return entries[index] ?? '';
		},
		down() {
			if (index < entries.length - 1) {
				index += 1;
				return entries[index] ?? '';
			}
			index = entries.length;
			return '';
		},
	};
}
