<template>
	<private-view :title="currentSection.name">
		<template #headline>{{ $t('docs') }}</template>
		<template #title-outer:prepend>
			<v-button rounded disabled icon>
				<v-icon :name="currentSection.icon" />
			</v-button>
		</template>

		<template #navigation>
			<docs-navigation />
		</template>

		<div class="docs">
			{{section}} {{file}}
		</div>
	</private-view>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import DocsNavigation from '../components/navigation.vue';
import marked from 'marked';
import sections from '../components/sections'

declare module '*.md'; 

export default defineComponent({
	components: { DocsNavigation },
	props: {
		section: {
			type: String,
			default: null
		},
		file: {
			type: String,
			default: null
		}
	},
	setup(props) {
		const currentSection = computed(() => {
			const section = sections.find((s) => s.to.split('/')[2] === props.section)
			if(section === undefined) return sections[0]
			return section
		})

		const currentfile = computed(() => {
			if(props.file !== null) return props.file
			return 'readme.md'
		})

		const sectionData = computed(() => {
		})

		const text = computed(async () => {
			if(currentfile.value === null) return null
			// const mdFile = await import(`@directus/docs/${currentSection.value}/${currentfile.value}`)
			const readme = "# Readme"
			return await marked(readme)
		})

		return {text, currentSection}
	}
});
</script>

<style lang="scss" scoped>
.docs {
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);
}
</style>
