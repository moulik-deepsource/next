import { i18n } from '@/lang';

export default [
	{
		icon: 'bubble_chart',
		name: i18n.t('getting_started'),
        to: `/docs/getting-started`,
        default: 'readme.md'
	},
	{
		icon: 'school',
		name: i18n.t('concepts'),
        to: `/docs/concepts`,
        default: 'readme.md'
	},
	{
		icon: 'format_list_numbered',
		name: i18n.t('guides'),
		to: `/docs/guides`,
		default: 'readme.md'
	},
	{
		icon: 'code',
		name: i18n.t('api_reference'),
        to: `/docs/api-reference`,
        default: 'readme.md'
	},
];
