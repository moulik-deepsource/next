<template>
	<div v-if="sections === undefined">Reference not found</div>
	<schema v-else-if="sections[0] === 'schemas'" :data="data" :name="sections[1]" />
	<parameter v-else-if="sections[0] === 'parameters'" :data="data" />
	<response v-else-if="sections[0] === 'responses'" :data="data" :status="status" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../../components/openapi.json';
import { SchemaObject, SchemasObject, ComponentsObject } from 'openapi3-ts';

export function getReferenceSections(ref: string) {
	return ref.match(/^#\/components\/(.*?)\/(.*?)$/)?.slice(1);
}

export function getReference(ref: string): undefined | object {
	const sections = getReferenceSections(ref);
	if (sections === undefined) return undefined;
	const type = sections[0];
	const name = sections[1];
	return (openapi.components as ComponentsObject)[type][name];
}

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
		const sections = computed(() => getReferenceSections(props.reference));
		const data = computed(() => getReference(props.reference));
		return { sections, data };
	},
});
</script>
