export interface Project {
	name: string;
	tag: string;
	description: string;
	link: string;
}

export const projects: Project[] = [
	{
		name: 'osprey',
		tag: 'Integration & reliability engineering',
		description:
			'An integration/automation backend on AWS Lambda + API Gateway, Terraform-provisioned end to end (CloudFront, WAF, SSM-managed secrets), CI-gated via GitHub Actions with Vitest coverage thresholds. SSRF-hardened outbound requests, idempotency-key/DLQ handling for reliable webhook delivery, and self-graded engineering docs under docs/decisions/.',
		link: 'https://github.com/tayclark/osprey',
	},
	{
		name: 'coast-crm',
		tag: 'SaaS & observability',
		description:
			'A multi-tenant CRM (Next.js on AWS Amplify SSR) running day-to-day operations for real home-service businesses, instrumented end-to-end with OpenTelemetry → Honeycomb.',
		link: 'https://github.com/tayclark/coast-crm',
	},
	{
		name: 'clutterclear',
		tag: 'AI & mobile',
		description:
			'An AI vision-based resale-estimate app — YOLOv8 detection plus a local Ollama vision LLM pipeline, end to end.',
		link: 'https://github.com/tayclark/clutterclear',
	},
];
