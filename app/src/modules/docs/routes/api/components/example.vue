<template>
	<container name="EXAMPLE">
		<div class="example">
			{{ example }}
		</div>
	</container>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { SchemaObject, SchemasObject } from 'openapi3-ts';
import Container from './container.vue';

export default defineComponent({
	components: { Container },
	props: {
		data: {
			type: Object as PropType<SchemaObject>,
			default: null,
		},
	},
	setup(props) {
		const example = computed(() => {
			if (props.data.value === undefined) return;
			const schemas = props.data.value[1].properties as SchemasObject;
			const examples = filterExamples(schemas);
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
