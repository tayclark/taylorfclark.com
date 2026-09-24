export const SITE_TITLE = 'Taylor Clark — Software & Integration Engineer';
export const SITE_DESCRIPTION =
	'Backend and integrations engineer with a decade of experience building and operating production systems at early-stage SaaS startups.';

export interface Target {
	key: string;
	verb: 'open' | 'cd';
	href: string;
	external?: boolean;
}

export interface SiteLink extends Target {
	label: string;
}

export const contactLinks: SiteLink[] = [
	{
		label: 'GitHub',
		href: 'https://github.com/tayclark',
		key: 'github',
		verb: 'open',
		external: true,
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/taylorfc',
		key: 'linkedin',
		verb: 'open',
		external: true,
	},
	{
		label: 'Email',
		href: 'mailto:taylorfclark@gmail.com',
		key: 'email',
		verb: 'open',
		external: false,
	},
];

export const pageLinks: SiteLink[] = [
	{ label: 'Projects', href: '/projects', key: 'projects', verb: 'cd', external: false },
	{ label: 'Experience', href: '/experience', key: 'experience', verb: 'cd', external: false },
];

export const terminalTargets: Target[] = [...contactLinks, ...pageLinks].map(
	({ key, verb, href, external }) => ({ key, verb, href, external }),
);
