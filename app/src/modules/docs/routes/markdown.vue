<template>
	<private-view :title="title">
		<template v-if="notFound === false" #headline>Documentation</template>
		<template v-if="notFound === false" #title-outer:prepend>
			<v-button rounded disabled icon>
				<v-icon :name="section.icon || section.sectionIcon" />
			</v-button>
		</template>

		<template #navigation>
			<docs-navigation />
		</template>
		<div class="error" v-if="notFound">
			<v-info icon="not_interested" title="Documentation Not Found">
				The documentation you are looking for doesn't seem to exist.
			</v-info>
		</div>
		<div v-else class="docs">
			<div class="md" v-html="html" />
		</div>
	</private-view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from '@vue/composition-api';
import DocsNavigation from '../components/navigation.vue';
import marked from 'marked';
import highlight from 'highlight.js';
import { Section } from '../components/sections';

declare module '*.md';

export default defineComponent({
	components: { DocsNavigation },
	props: {
		section: {
			type: Object as PropType<Section>,
			default: null,
		},
	},
	setup(props) {
		const mdString = ref<string | null>(null);

		const notFound = computed(() => props.section === null || mdString.value === null);

		const title = computed(() => (notFound.value ? 'Page Not Found' : props.section.name));

		const html = computed(() => {
			if (mdString.value === null) return '';

			let html = marked(mdString.value, { highlight: (code) => highlight.highlightAuto(code).value });

			const regex = /:::(.*?) (.*?)\n((\s|.)*?):::/gm;

			html = html.replaceAll(regex, (match: string, type: string, title: string, body: string) => {
				return `<div class="hint ${type}"><p class="hint-title">${title}</p><p class="hint-body">${body}</p></div>`;
			});

			return html;
		});

		watch(() => props.section, loadMD, { immediate: true });

		return { html, notFound, title };

		async function loadMD() {
			if (props.section === null) {
				mdString.value = null;
				return;
			}

			const loadString = props.section.to.replace('/docs', '');

			try {
				const md = await import(`raw-loader!@directus/docs${loadString}.md`);
				mdString.value = md.default;
			} catch (exception) {
				mdString.value = null;
			}
		}
	},
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/markdown.scss';

.error {
	padding: 20vh 0;
}

.docs {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);

	.md {
		max-width: 740px;

		::v-deep {
			@include markdown;
		}
	}
}
</style>
