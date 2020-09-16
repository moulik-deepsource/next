import { defineModule } from '@/modules/define';
import AppReference from './routes/app.vue'
import ApiReference from './routes/api.vue'
import GettingStarted from './routes/start.vue'
import Concepts from './routes/concepts.vue'
import Guides from './routes/guides.vue'

export default defineModule(({ i18n }) => ({
	id: 'docs',
	name: i18n.t('docs'),
	icon: 'info',
	routes: [
		{
			path: '/',
			redirect: '/getting-started',
		},
		{
			name: 'docs-app',
			path: '/app-reference',
			component: AppReference,
		},
		{
			name: 'docs-api',
			path: '/api-reference',
			component: ApiReference,
		},
		{
			name: 'docs-start',
			path: '/getting-started',
			component: GettingStarted,
		},
		{
			name: 'docs-concepts',
			path: '/concepts',
			component: Concepts,
		},
		{
			name: 'docs-guides',
			path: '/guides',
			component: Guides,
		},
	],
	order: Infinity,
	persistent: true,
}));
