<template>
	<reference v-if="isReference" :reference="data.$ref" />
	<schema v-else :data="schema" :name="data.name" :required="data.required" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../../components/openapi.json';
import { ParameterObject, SchemaObject } from 'openapi3-ts';

export default defineComponent({
	props: {
		data: {
			type: Object as PropType<ParameterObject>,
			default: null,
		},
	},
	setup(props) {
		const isReference = computed(() => props.data !== null && '$ref' in props.data);
		const schema = computed(() => {
			if (isReference.value) return;
			const data = props.data.schema as SchemaObject;
			data.description = props.data.description;
			return data;
		});

		return { isReference, schema };
	},
});
</script>
