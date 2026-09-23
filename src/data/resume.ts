export interface ResumeEntry {
	role: string;
	org: string;
	dates: string;
	blurb?: string;
	bullets: string[];
	tech: string;
}

export interface ResumeSection {
	title: string;
	entries: ResumeEntry[];
}

export interface ResumeData {
	name: string;
	contact: string;
	summary: string;
	sections: ResumeSection[];
}

export const resume: ResumeData = {
	name: 'Taylor Clark',
	contact:
		'Ocean Springs, MS · taylorfclark@gmail.com · linkedin.com/in/taylorfc · github.com/tayclark',
	summary:
		'Backend and integrations engineer with a decade of experience building and operating production systems at early-stage SaaS startups, currently running technical delivery for a small multi-product shop. Hands-on across AWS (Lambda, CloudFront, WAF), Terraform, PostgreSQL/Prisma, CI/CD (GitHub Actions), and observability (OpenTelemetry/Honeycomb). Deep integration/API domain expertise — webhook design, auth, error handling across systems — with a track record of leading integration teams and driving infrastructure cost savings.',
	sections: [
		{
			title: 'Experience',
			entries: [
				{
					role: 'Founder / Technical Lead',
					org: 'Coast Software (Remote)',
					dates: 'Feb 2025–Present',
					blurb:
						'Coast Software operates home-service businesses (remodeling, landscaping, seasonal installation) and builds the software platforms that run them.',
					bullets: [
						'Operate multiple home-service businesses directly, giving every product decision below real operator context rather than assumptions.',
						'Designed and built osprey, an integration/automation backend: AWS Lambda + API Gateway on Terraform-provisioned infrastructure (CloudFront, WAF, SSM-managed secrets), CI-gated via GitHub Actions with Vitest coverage thresholds.',
						"Hardened osprey's webhook delivery with SSRF-protected outbound requests and a designed idempotency-key/DLQ pattern for reliability.",
						'Built coast-crm, a multi-tenant CRM (Next.js on AWS Amplify SSR) instrumented end-to-end with OpenTelemetry → Honeycomb; also shipped clutterclear (AI vision-based resale-estimate app) and three client marketing sites (Astro/Tailwind, Lighthouse CI gates, Playwright e2e).',
					],
					tech: 'TypeScript, Node.js, Next.js, Python/FastAPI, PostgreSQL, Prisma, AWS (Lambda, CloudFront, WAF, SSM), Terraform, GitHub Actions, OpenTelemetry, Honeycomb, Expo/React Native',
				},
				{
					role: 'Senior Software Engineer II',
					org: 'Vitally.io (Remote, Brooklyn)',
					dates: 'May 2021–Nov 2024',
					blurb:
						'Vitally built a customer success platform for the B2B SaaS market. Joined post-Series A (employee #9) in a full-stack role focused on integrations and product enhancements as Vitally grew 10x ARR ($1M → $10M).',
					bullets: [
						'Served as technical lead for an integrations team of Vitally FTE and offshore contract engineers, remedying multiple ongoing integration issues.',
						'Owned all integrations with oversight for design, project planning, and execution.',
						'Drove design/implementation of a new integration framework using common jobs to send/receive data updates, reducing effort for new integrations and improving monitoring/observability.',
						'Executed SRE responsibilities; collaborated on database tuning and observability across all services.',
						"Guided a platform team's infrastructure cost optimization, resulting in 40% savings in database spend.",
					],
					tech: 'TypeScript, Node.js, Kafka, Redis, ClickHouse, PostgreSQL, Terraform, AWS',
				},
				{
					role: 'Senior Solutions Architect, Embedded',
					org: 'Tray.io (Remote, SF)',
					dates: 'Nov 2019–May 2021',
					blurb:
						'Tray.io (now Tray.ai) is an iPaaS and automation platform. Recruited as employee ~90 after Series B as technical lead/architect for a new Embedded iPaaS product.',
					bullets: [
						'Developed on-premise connectors for enterprise systems.',
						'Co-founded a Professional Services organization as technical lead, leading a team of four engineers.',
						'Documented Tray Embedded onboarding best practices, reducing TTV from 45 to 14 days.',
						'Provided integration subject matter expertise to pre-sales and advised clients on integration best practices.',
					],
					tech: 'TypeScript, Node.js, GraphQL, AWS, iPaaS',
				},
				{
					role: 'Software Engineer II',
					org: 'Cloud Elements (Remote, Denver)',
					dates: 'Aug 2016–Nov 2019',
					blurb:
						'Cloud Elements was a startup iPaaS and automation platform (acquired by UiPath). Initially hired as a Customer Success intern; returned in software development prior to Series B.',
					bullets: [
						'Served as team lead for a 5-member contract team delivering ~120 new connectors.',
						'Productized several services and tooling to enhance connector development.',
						'Transitioned to a platform team migrating all services to Kubernetes to reduce costs.',
						'Traveled internationally to train overseas support and engineering teams.',
					],
					tech: 'Node.js, React, Java, Python, Kafka, Redis, PostgreSQL, Kubernetes, Docker, AWS',
				},
			],
		},
		{
			title: 'Education',
			entries: [
				{
					role: 'BBA (Cum Laude), Information Systems',
					org: 'Mississippi State University',
					dates: '',
					bullets: ['2016 Moore Award for Excellence in Information Systems'],
					tech: '',
				},
			],
		},
	],
};
