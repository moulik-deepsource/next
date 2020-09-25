<template>
	<pre class="example">{{ example }}</pre>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { ReferenceObject, SchemaObject, SchemasObject } from 'openapi3-ts';
import Container from './container.vue';
import { getReference } from './reference.vue';

export default defineComponent({
	components: { Container },
	props: {
		data: {
			type: Object as PropType<SchemaObject | ReferenceObject>,
			default: null,
		},
	},
	setup(props) {
		const example = computed(() => {
			if (props.data === undefined) return;
			let schemas = props.data;
			if (schemas === undefined) return;
			if ('$ref' in schemas) {
				schemas = getReference(schemas.$ref) as SchemaObject;
			}
			if (schemas.properties === undefined) return;
			const examples = filterExamples(schemas.properties);
			return JSON.stringify(examples, null, 4);
		});

		return { example };

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
