import { defineModule } from '@/modules/define';
import Docs from './routes/docs.vue';
import sections, { Section, Divider, defaultSection } from './components/sections';
import { Route } from 'vue-router';
import { cloneDeep } from 'lodash';

function props(route: Route) {
	return { path: route.path };
}

export default defineModule(({ i18n }) => ({
	id: 'docs',
	name: i18n.t('documentation'),
	icon: 'info',
	routes: [
		{
			path: '/*',
			beforeEnter: (to, from, next) => {
				if (to.path === '/docs/') next(defaultSection);
				else next();
			},
			component: Docs,
			props
		},
	],
	order: 20,
}));
