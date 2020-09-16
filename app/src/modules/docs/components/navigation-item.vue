<template>
	<v-list-item v-if="section.children === undefined">
		<v-list-item-icon><v-icon v-if="section.icon" :name="section.icon" /></v-list-item-icon>
		<v-list-item-content>
			<v-list-item-title>{{ section.name }}</v-list-item-title>
		</v-list-item-content>
	</v-list-item>
	<v-list-group v-else>
		<template #activator>
			<v-icon v-if="section.icon" :name="section.icon" />
			{{ section.name }}
		</template>
		<navigation-list-item v-for="(childSection, index) in section.children" :key="index" :section="childSection" />
	</v-list-group>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { Section } from './sections';

export default defineComponent({
	name: 'navigation-list-item',
	props: {
		section: {
			type: Object as PropType<Section>,
			default: null,
		},
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
