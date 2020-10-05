import { useSpecsStore } from '@/stores'
import { TagObject } from 'openapi3-ts';

async function getOASSections(dynamic: boolean) {
	const openapi = await useSpecsStore().getOAS();
	if( openapi === null ) return []
	const tags = openapi.tags as TagObject[] | undefined
	if( tags === undefined ) return []

	return tags.filter((tag) => tag.name.endsWith('Collection') === dynamic)
	.map((tag) => {
		const id = tag.name.replace(/ /g, '-').toLowerCase();
		const section: Section = {
			name: tag.name,
			to: `/docs/api-reference/${id}`,
			description: tag.description,
		};
		return section;
	})
				
}

let staticOASSections: Section[] = [];
let dynamicOASSections: Section[] = [];

(async function loadSections() {
	staticOASSections = await getOASSections(false);
	dynamicOASSections = await getOASSections(true);
})()



export type Section = {
	name: string;
	to: string;
	description?: string;
	icon?: string;
	sectionIcon?: string;
	children?: (Section | Divider)[];
	sectionName?: string;
	default?: string;
};

export type Divider = {
	divider: boolean;
};

export const defaultSection = '/docs/getting-started/introduction';

const sections: (Section | Divider)[] = [
	{
		icon: 'play_arrow',
		name: 'Getting Started',
		to: '/docs/getting-started',
		default: '',
		children: [
			{
				name: 'Introduction',
				to: '/docs/getting-started/introduction',
			},
			{
				name: 'Troubleshooting',
				to: '/docs/getting-started/troubleshooting',
			},
			{
				name: 'Contributing',
				to: '/docs/getting-started/contributing',
			},
			{
				name: 'Supporting Directus',
				to: '/docs/getting-started/supporting-directus',
			},
		],
	},
	{
		icon: 'school',
		name: 'Concepts',
		to: '/docs/concepts',
		default: 'readme',
		children: [
			{
				name: 'Platform Overview',
				to: '/docs/concepts/platform-overview',
			},
			{
				name: 'App Overview',
				to: '/docs/concepts/app-overview',
			},
			{
				name: 'App Extensions',
				to: '/docs/concepts/app-extensions',
			},
			{
				name: 'Activity & Versions',
				to: '/docs/concepts/activity-and-versions',
			},
			{
				name: 'Files & Thumbnails',
				to: '/docs/concepts/files-and-thumbnails',
			},
			{
				name: 'Internationalization',
				to: '/docs/concepts/internationalization',
			},
			{
				name: 'Relationships',
				to: '/docs/concepts/relationships',
			},
			{
				name: 'Users, Roles & Permissions',
				to: '/docs/concepts/users-roles-and-permissions',
			},
		],
	},
	{
		icon: 'article',
		name: 'Guides',
		to: '/docs/guides',
		default: 'readme',
		children: [
			{
				name: 'Projects',
				to: '/docs/guides/projects',
			},
			{
				name: 'Collections',
				to: '/docs/guides/collections',
			},
			{
				name: 'Fields',
				to: '/docs/guides/fields',
			},
			{
				name: 'Users & Roles',
				to: '/docs/guides/users-and-roles',
			},
			{
				name: 'Presets & Bookmarks',
				to: '/docs/guides/presets',
			},
			{
				name: 'Webhooks',
				to: '/docs/guides/webhooks',
			},
			{
				name: 'White-Labeling',
				to: '/docs/guides/white-labeling',
			},
			{
				name: 'Extensions',
				to: '/docs/guides/extensions',
				children: [
					{
						name: 'Custom Displays',
						to: '/docs/guides/extensions/creating-a-custom-display',
					},
					{
						name: 'Custom Interfaces',
						to: '/docs/guides/extensions/creating-a-custom-interface',
					},
					{
						name: 'Custom Layouts',
						to: '/docs/guides/extensions/creating-a-custom-layout',
					},
					{
						name: 'Custom Modules',
						to: '/docs/guides/extensions/creating-a-custom-module',
					},
					{
						name: 'Custom API Endpoints',
						to: '/docs/guides/extensions/creating-a-custom-api-endpoint',
					},
					{
						name: 'Custom API Hooks',
						to: '/docs/guides/extensions/creating-a-custom-api-hook',
					},
					{
						name: 'Custom Email Templates',
						to: '/docs/guides/extensions/creating-a-custom-email-template',
					},
					{
						name: 'Custom Storage Adapters',
						to: '/docs/guides/extensions/creating-a-custom-storage-adapter',
					},
					{
						name: 'Accessing Data',
						to: '/docs/guides/extensions/accessing-data',
					},
				],
			},
		],
	},
	{
		icon: 'code',
		name: 'Reference',
		to: '/docs/reference',
		default: 'readme',
		children: [
			{
				name: 'Environment Variables',
				to: '/docs/reference/environment-variables',
			},
			{
				name: 'Command Line Interface',
				to: '/docs/reference/command-line-interface',
			},
			{
				name: 'Error Codes',
				to: '/docs/reference/error-codes',
			},
		],
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
			{ divider: true },
			...dynamicOASSections,
			{ divider: true },
			...staticOASSections
		],
	},
];

export default sections;
