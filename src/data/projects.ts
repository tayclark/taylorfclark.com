export interface Project {
	name: string;
	tag: string;
	description: string;
	problem: string;
	approach: string;
	outcome: string;
	stack: string[];
	/** Only set when the number comes from the repo itself; never estimated. */
	metric?: string;
	/** Omitted for private repositories. */
	link?: string;
}

export const projects: Project[] = [
	{
		name: 'osprey',
		tag: 'Integration & reliability engineering',
		description:
			'A workflow automation backend on AWS Lambda, Terraform-provisioned end to end, that runs the contact-form and status automations for my client sites.',
		problem:
			'Static client sites had nowhere to send form submissions, and glue automations were scattered across third-party tools with no reliability guarantees.',
		approach:
			'Workflows are declared as JSON, validated, and run step by step from the CLI, over HTTP or on a cron schedule. Infrastructure is Terraform (Lambda, API Gateway, CloudFront, WAF, EventBridge, SSM-managed secrets). Outbound requests are SSRF-hardened, and the repo carries ADRs and a self-graded service assessment.',
		outcome:
			'A v0 built for internal use: CI-gated with Vitest coverage thresholds and graded honestly per pillar, with the gaps before external traffic documented in the repo.',
		stack: ['TypeScript', 'AWS Lambda', 'Terraform', 'PostgreSQL', 'Prisma', 'Vitest'],
	},
	{
		name: 'coast-crm',
		tag: 'SaaS & observability',
		description:
			'A multi-tenant business portal for home-service companies: customers, invoicing and job dispatch.',
		problem:
			'The home-service businesses I operate needed one system for customers, invoices and jobs, with each business strictly isolated from the others.',
		approach:
			'Next.js and Prisma on PostgreSQL. Tenant isolation is enforced in the service layer (every query takes an explicit owner id), with Postgres row-level security as defense in depth on the payment and invoice tables. Traces and metrics go through OpenTelemetry to Honeycomb.',
		outcome:
			'In active development and not yet in production. Customers, invoicing and jobs are built; payments are on the roadmap.',
		stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenTelemetry', 'AWS Amplify'],
	},
	{
		name: 'gulf-coast-fishing-app',
		tag: 'Mobile & external data',
		description:
			'An offline-first Expo app that puts Gulf Coast tide and water conditions on a map of fishing spots.',
		problem:
			'Fishing spots are often out of signal range, but tide and conditions data comes from live public APIs.',
		approach:
			'Expo and React Native with a SQLite offline cache and React Query persistence that follows connectivity. Tide data comes from a NOAA CO-OPS provider tested against recorded fixtures rather than the live API.',
		outcome:
			'An early prototype, local-first, with unit tests and CI coverage reporting in place from the start.',
		stack: ['Expo', 'React Native', 'TypeScript', 'SQLite', 'React Query', 'Jest'],
	},
];

export const clientSites: { name: string; note: string }[] = [
	{ name: 'maisondelu', note: 'Restaurant site' },
	{ name: 'cochran-pools', note: 'Pool-service site' },
	{ name: 'coast-software', note: 'Agency site' },
];
