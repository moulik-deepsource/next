<template>
	<div v-if="sections === undefined">Reference not found</div>
	<schema v-else-if="sections[0] === 'schemas'" :data="data" />
	<parameter v-else-if="sections[0] === 'parameters'" :data="data" />
	<response v-else-if="sections[0] === 'responses'" :data="data" :status="status" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../../components/openapi.json';
import { SchemaObject, SchemasObject, ComponentsObject } from 'openapi3-ts';

export default defineComponent({
	props: {
		reference: {
			type: String,
			default: null,
		},
		status: {
			type: String,
			default: null,
		},
	},
	setup(props) {
		const sections = computed(() => props.reference.match(/^#\/components\/(.*?)\/(.*?)$/)?.slice(1));
		const data = computed(() => {
			if (sections.value === undefined) return undefined;
			const type = sections.value[0];
			const name = sections.value[1];
			return (openapi.components as ComponentsObject)[type][name];
		});
		return { sections, data };
	},
});
</script>
