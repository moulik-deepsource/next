<template>
	<v-list nav>
		<v-list-item v-for="item in navItems" :to="item.to" :key="item.to">
			<v-list-item-icon><v-icon :name="item.icon" /></v-list-item-icon>
			<v-list-item-content>
				<v-list-item-title>{{ item.name }}</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
	</v-list>
</template>

<script lang="ts">
import { defineComponent, toRefs } from '@vue/composition-api';
import { i18n } from '@/lang';

export default defineComponent({
	setup() {
		const navItems = [
			{
				icon: 'bubble_chart',
				name: i18n.t('getting_started'),
				to: `/docs/getting-started`,
			},
			{
				icon: 'school',
				name: i18n.t('concepts'),
				to: `/docs/concepts`,
			},
			{
				icon: 'format_list_numbered',
				name: i18n.t('guides'),
				to: `/docs/guides`,
				outline: true,
			},
			{
				icon: 'code',
				name: i18n.t('app_reference'),
				to: `/docs/app-reference`,
			},
			{
				icon: 'code',
				name: i18n.t('api_reference'),
				to: `/docs/api-reference`,
			},
		];

		return { navItems };
	},
});
</script>

<style lang="scss" scoped>
.version {
	.v-icon {
		color: var(--foreground-subdued);
		transition: color var(--fast) var(--transition);
	}
	::v-deep .type-text {
		color: var(--foreground-subdued);
		transition: color var(--fast) var(--transition);
	}
	&:hover {
		.v-icon {
			color: var(--foreground-normal);
		}
		::v-deep .type-text {
			color: var(--foreground-normal);
		}
	}
}
</style>
