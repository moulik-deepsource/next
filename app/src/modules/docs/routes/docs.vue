<template>
	<private-view :title="title">
		<template #headline>Documentation</template>
		<template v-if="notFound === false" #title-outer:prepend>
			<v-button rounded disabled icon>
				<v-icon :name="apiView ? 'code' : section.icon || section.sectionIcon" />
			</v-button>
		</template>

		<template #navigation>
			<docs-navigation />
		</template>

		<v-info v-if="notFound" icon="not_interested" title="Api Reference Not Found">
			The api reference you are looking for doesn't seem to exist.
		</v-info>
		<api v-else-if="apiView" :section="section" />
		<markdown v-else :section="section" />
	</private-view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from '@vue/composition-api';
import DocsNavigation from '../components/navigation.vue';
import { Section } from '../components/sections';
import Api from './api/api.vue';
import Markdown from './markdown.vue';

declare module '*.md';

export default defineComponent({
	components: { DocsNavigation, Api, Markdown },
	props: {
		section: {
			type: Object as PropType<Section>,
			default: null,
		},
	},
	setup(props) {
		const notFound = computed(() => props.section === null);
		const apiView = computed(() => props.section && props.section.to.startsWith('/docs/api-reference'));
		const title = computed(() => {
			if (notFound.value) return 'Page not Found';
			return apiView.value ? 'Api Reference' : props.section.name;
		});
		return { apiView, notFound, title };
	},
});
</script>
<style lang="scss" scoped>
.v-info {
	padding: 20vh 0;
}
</style>
