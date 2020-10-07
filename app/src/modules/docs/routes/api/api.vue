<template>
	<div class="api-reference">
		<general v-if="type === 'general'" :section="section" />
		<endpoints v-else :section="section" :page="type" />
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import DocsNavigation from '../../components/navigation.vue';
import { Section } from '../../components/sections';
import General from './general.vue';
import Endpoints from './endpoints.vue';
import './components';

export default defineComponent({
	components: { DocsNavigation, General, Endpoints },
	props: {
		section: {
			type: Object as PropType<Section>,
			default: null,
		},
	},
	setup(props) {
		const type = computed(() => {
			const sections = props.section.to.split('/');
			if (sections.length < 3) return null;
			return sections[3];
		});

		return { type };
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
