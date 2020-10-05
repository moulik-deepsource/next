<template>
	<private-view :title="notFound ? $t('page_not_found') : title">
		<template #headline>{{ $t('documentation') }}</template>

		<template #title-outer:prepend>
			<v-button rounded disabled icon>
				<v-icon :name="isAPIReference ? 'code' : section.icon || section.sectionIcon" />
			</v-button>
		</template>

		<template #navigation>
			<docs-navigation :sections="navSections" />
		</template>

		<v-progress-circular v-if="loading" indeterminate/>
		<div v-else-if="notFound" class="not-found">
			<v-info :title="$t('page_not_found')" icon="not_interested">
				{{ $t('page_not_found_body') }}
			</v-info>
		</div>
		<api v-else-if="isAPIReference" :section="section" />
		<markdown v-else>{{ mdString }}</markdown>
	</private-view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from '@vue/composition-api';
import DocsNavigation from '../components/navigation.vue';
import sections, { Section, Divider } from '../components/sections';
import Api from './api/api.vue';
import Markdown from './markdown.vue';
import i18n from '@/lang';
import { Route } from 'vue-router';
import { cloneDeep } from 'lodash';
import { OpenAPIObject, TagObject } from 'openapi3-ts';
import getOAS from '../components/specs'

declare module '*.md';

export default defineComponent({
	components: { DocsNavigation, Api, Markdown },
	props: {
		path: {
			type: String,
			default: null
		}
	},
	setup(props) {
		const mdString = ref<string | null>(null);
		const openapi = getOAS()
		const loading = ref(true);
		const error = ref(null);

		const { section, navSections } = useSection()

		const isAPIReference = computed(() => props.path && props.path.startsWith('/docs/api-reference'));
		const notFound = computed(() => {
			return error.value !== null;
		});

		const title = computed(() => {
			if(loading.value) return i18n.t('loading')
			return isAPIReference.value ? i18n.t('api_reference') : section.value?.sectionName;
		});

		watch(() => props.path, loadMD, { immediate: true });

		return { isAPIReference, notFound, title, mdString, section, navSections, loading };

		async function loadMD() {
			if (isAPIReference.value) return;
			loading.value = true;
			error.value = null;

			if (section.value === null) {
				mdString.value = null;
				return;
			}
			const loadString = section.value?.to.replace('/docs', '');

			try {
				const md = await import(`raw-loader!@directus/docs${loadString}.md`);
				mdString.value = md.default;
			} catch (err) {
				mdString.value = null;
				error.value = err;
			} finally {
				loading.value = false;
			}
		}

		function useSection() {
			const navSections = computed(() => {
				const sectionsClone = cloneDeep(sections);
				
				const reference = sectionsClone.find((s) => 'to' in s && s.to === '/docs/api-reference') as Section | undefined
				if(reference === undefined) return null

				const dynamicSpecs = getOASSections(true)
				const staticSpecs = getOASSections(false)

				console.log(dynamicSpecs, staticSpecs);
				

				if(dynamicSpecs.length > 0) {
					reference.children?.push({divider: true})
					reference.children?.push(...dynamicSpecs)
				}
				if(staticSpecs.length > 0) {
					reference.children?.push({divider: true})
					reference.children?.push(...staticSpecs)
				}

				return sectionsClone;
			})

			const section = computed(() => {
				if(navSections.value === null) return null;
				return urlToSection(urlSplitter(props.path), navSections.value);
			})

			function getOASSections(dynamic: boolean) {
				if( openapi.value === null ) return []

				const tags = openapi.value.tags as TagObject[] | undefined
				if( tags === undefined ) return []

				return tags.filter((tag) => tag.name.endsWith('Collection') === dynamic)
				.map((tag) => {
					const id = tag.name.replace(/ /g, '-').toLowerCase();
					const section: Section = {
						name: tag.name,
						to: `/docs/api-reference/${id}`,
						description: tag.description,
					};
					return section;
				})
							
			}

			function urlSplitter(url: string) {
				if (url.startsWith('/docs')) url = url.replace('/docs', '');
				if (url.startsWith('/')) url = url.substr(1);
				return url.split('/');
			}

			function urlToSection(urlSections: string[], sections: (Section | Divider)[]): Section | null {
				let section = sections.find((s) => 'to' in s && urlSplitter(s.to).pop() === urlSections[0]) as
					| Section
					| undefined;

				if (section === undefined) {
					return null;
				}

				section = cloneDeep(section);

				if (urlSections.length === 1) {
					let finalSection = section;
					let index = 0;
					while (finalSection.children !== undefined && finalSection.children.length < index) {
						if ('divider' in finalSection.children[index]) {
							index++;
						} else {
							index = 0;
							finalSection = finalSection.children[index] as Section;
						}
					}
					if (section.icon) finalSection.icon = section.icon;
					if (finalSection.sectionName === undefined) finalSection.sectionName = section.name;
					return finalSection;
				}

				if (section.children === undefined) return null;

				const sectionDeep = urlToSection(urlSections.slice(1), section.children);

				if (sectionDeep !== null && sectionDeep.sectionName === undefined) {
					sectionDeep.sectionName = section.name;
				}

				if (
					sectionDeep !== null &&
					sectionDeep.icon === undefined &&
					sectionDeep.sectionIcon === undefined &&
					section.icon !== undefined
				)
					sectionDeep.sectionIcon = section.icon;
				return sectionDeep;
			}

			return {section, navSections}
		}
	},
});
</script>
<style lang="scss" scoped>

.not-found {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20vh 0;
}
</style>
