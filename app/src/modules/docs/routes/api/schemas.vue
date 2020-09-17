<template>
	<div class="schema">
		<h1>{{ schema[0] }}</h1>

		<h2>Example</h2>
		<interface-code :value="example"></interface-code>

		<h2>Schema</h2>
		<schema-component :schema="schema[1]"></schema-component>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../components/openapi-deref.json';
import { Section } from '../../components/sections';
import SchemaComponent from './components/schema.vue';
import { SchemaObject, SchemasObject } from 'openapi3-ts';

export default defineComponent({
	components: { SchemaComponent },
	props: {
		section: {
			type: Object as PropType<Section>,
		},
		page: {
			type: String,
			default: null,
		},
	},
	setup(props) {
		const example = computed(() => {
			if (schema.value === undefined) return;
			const schemas = schema.value[1].properties as SchemasObject;
			const examples = filterExamples(schemas);
			return JSON.stringify(examples, null, 4);
		});

		const schema = computed(() => {
			const schemas = openapi.components.schemas as SchemasObject;
			const entry = Object.entries(schemas).find(([key]) => {
				return key.toLowerCase().replaceAll(' ', '-') === props.page;
			});

			return entry;
		});

		return { schema, example };

		function filterExamples(schema: Record<string, SchemaObject>) {
			const obj: Record<string, string | Record<string, any>> = {};

			Object.entries(schema).map(([key, value]) => {
				if (value.type === 'object' && value.properties !== undefined) {
					obj[key] = filterExamples(value.properties);
				} else if (value.example !== undefined) {
					obj[key] = value.example;
				}
			});
			return obj;
		}
	},
});
</script>

<style lang="scss" scoped>
h1 {
	margin: 16px 0 32px 0;
	font-size: 24px;
}

h2 {
	margin: 16px 0;
	font-size: 20px;
}
</style>
