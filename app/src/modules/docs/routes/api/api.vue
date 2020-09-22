<template>
	<div class="error" v-if="notFound">
		<v-info icon="not_interested" title="Api Reference Not Found">
			The api reference you are looking for doesn't seem to exist.
		</v-info>
	</div>
	<div class="api-reference" v-else>
		<general v-if="type === 'general'" :section="section" />
		<endpoints v-else-if="type === 'endpoints'" :section="section" :page="page" />
		<schemas v-else-if="type === 'schemas'" :section="section" :page="page" />
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import DocsNavigation from '../../components/navigation.vue';
import { Section } from '../../components/sections';
import General from './general.vue';
import Schemas from './schemas.vue';
import Endpoints from './endpoints.vue';

export default defineComponent({
	components: { DocsNavigation, General, Endpoints, Schemas },
	props: {
		section: {
			type: Object as PropType<Section>,
			default: null,
		},
	},
	setup(props) {
		const notFound = computed(() => props.section === null);

		const type = computed(() => {
			const sections = props.section.to.split('/');
			if (sections.length < 3) return null;
			return sections[3];
		});

		const page = computed(() => {
			const sections = props.section?.to.split('/');
			if (sections.length < 4) return null;
			return sections[4];
		});

		return { notFound, type, page };
	},
});
</script>

<style lang="scss" scoped>
.error {
	padding: 20vh 0;
}

.api-reference {
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);
}
</style>
