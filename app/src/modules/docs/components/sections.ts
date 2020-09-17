import { tags, components } from '../components/openapi-deref.json';

export type Section = {
	name: string;
	to: string;
	icon?: string;
	sectionIcon?: string;
	children?: Section[];
	default?: string;
};

const sections: Section[] = [
	{
		icon: 'bubble_chart',
		name: 'Getting Started',
		to: '/docs/getting-started',
		children: [
			{
				name: 'Introduction',
				to: '/docs/getting-started/introduction',
			},
			{
				name: 'Installation',
				to: '/docs/getting-started/installation',
			},
			{
				name: 'Contributing',
				to: '/docs/getting-started/contributing',
			},
			{
				name: 'Troubleshooting',
				to: '/docs/getting-started/trouble',
				children: [
					{
						name: 'Technical Support',
						to: '/docs/getting-started/trouble/tech-support',
					},
					{
						name: 'Premium Support',
						to: '/docs/getting-started/trouble/prem-support',
					},
				],
			},
		],
	},
	{
		icon: 'school',
		name: 'Concepts',
		to: '/docs/concepts',
		default: 'readme',
	},
	{
		icon: 'format_list_numbered',
		name: 'Guides',
		to: '/docs/guides',
		default: 'readme',
	},
	{
		icon: 'code',
		name: 'Api Reference',
		to: `/docs/api-reference`,
		children: [
			{
				name: 'General Information',
				to: '/docs/api-reference/general',
			},
			{
				name: 'Endpoints',
				to: '/docs/api-reference/endpoints',
				children: [
					...tags.map((tag) => {
						const id = tag.name.replace(' ', '-').toLowerCase();
						const section: Section = { name: tag.name, to: `/docs/api-reference/endpoints/${id}` };
						return section;
					}),
				],
			},
			{
				name: 'Components',
				to: '/docs/api-reference/schemas',
				children: [
					...Object.entries(components.schemas).map((entry) => {
						const id = entry[0].replace(' ', '-').toLowerCase();
						const section: Section = { name: entry[0], to: `/docs/api-reference/schemas/${id}` };
						return section;
					}),
				],
			},
		],
	},
];

export default sections;
