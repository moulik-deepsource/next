<template>
	<private-view :title="$t('getting_started')">
		<template #headline>{{ $t('docs') }}</template>
		<template #title-outer:prepend>
			<v-button rounded disabled icon>
				<v-icon name="bubble_chart" />
			</v-button>
		</template>

		<template #navigation>
			<docs-navigation />
		</template>

		<div class="docs">
			<h1>Gettin Started</h1>
		</div>
	</private-view>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import DocsNavigation from '../components/navigation.vue';

export default defineComponent({
	components: { DocsNavigation },
	setup() {
		
	},
});
</script>

<style lang="scss" scoped>
.docs {
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);
}
</style>
