import { defineModule } from '@/modules/define';
import ApiReference from './routes/api.vue'
import MarkdownView from './routes/markdown.vue'
import sections from './components/sections'
import {Route, NavigationGuard} from 'vue-router'

const reroute: NavigationGuard = function(to, from, next) {
	let section = sections.find((s) => s.to.split('/')[2] === to.params.section)

	if(section === undefined) return next(`${sections[0].to}/${sections[0].default}`)

	if(to.params.file === undefined) return next(`${section.to}/${section.default}`)

	return next()
}

export default defineModule(({ i18n }) => ({
	id: 'docs',
	name: i18n.t('docs'),
	icon: 'info',
	routes: [
		{
			name: 'docs-api',
			path: '/api-reference',
			component: ApiReference,
		},
		{
			path: '/',
			beforeEnter: reroute
		},
		{
			path: '/:section',
			beforeEnter: reroute
		},
		{
			name: 'markdown',
			path: '/:section/:file',
			beforeEnter: reroute,
			component: MarkdownView,
			props: true
		}
	],
	order: Infinity,
	persistent: true,
}));
