<template>
	<v-list nav>
		<v-list-item v-for="item in sections" :to="item.to" :key="item.to">
			<v-list-item-icon><v-icon :name="item.icon" /></v-list-item-icon>
			<v-list-item-content>
				<v-list-item-title>{{ item.name }}</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
	</v-list>
</template>

<script lang="ts">
import { defineComponent, toRefs } from '@vue/composition-api';
import sections from './sections'

export default defineComponent({
	setup() {
		return { sections };
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
