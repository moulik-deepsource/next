<template>
	<div>
		<div class="schema">
			<div v-if="name" class="name">{{ name }}</div>
			<div v-if="typeFiler" class="type-filter">{{ typeFiler }}</div>
			<div class="types">
				<div class="type" v-for="(type, index) in types" :key="index">
					<div v-if="type.type === 'object'" class="object">
						<div>Object</div>
						<div v-if="type.properties" class="properties">
							<schema v-for="(val, key) in type.properties" :key="key" :schema="val" :name="key"></schema>
						</div>
					</div>
					<div v-else-if="type.type === 'string'">
						<span>{{ type.type }}</span>
						<span v-if="type.format">{{ type.format }}</span>
						<span v-if="type.enum">Types: {{ type.enum }}</span>
					</div>
					<div v-else>{{ type.type }}</div>
					<div v-if="type.example" class="example">Example: {{ type.example }}</div>
					<div v-if="type.description" class="description">Description: {{ type.description }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import { SchemaObject } from 'openapi3-ts';

export default defineComponent({
	name: 'schema',
	components: {},
	props: {
		name: {
			type: String,
			default: null,
		},
		schema: {
			type: Object as PropType<SchemaObject>,
			default: null,
		},
	},
	setup(props) {
		const typeFiler = ref<'oneOf' | 'anyOf' | 'allOf' | null>(null);

		const types = computed(() => {
			const types: SchemaObject[] = [];

			if (props.schema.type !== undefined) {
				typeFiler.value = null;
				types.push(props.schema);
			} else if (props.schema.oneOf) {
				typeFiler.value = 'oneOf';
				types.push(...props.schema.oneOf);
			} else if (props.schema.anyOf) {
				typeFiler.value = 'anyOf';
				types.push(...props.schema.anyOf);
			} else if (props.schema.allOf) {
				typeFiler.value = 'allOf';
				types.push(...props.schema.allOf);
			}

			return types;
		});

		return { types, typeFiler };
	},
});
</script>

<style lang="scss" scoped>
.schema {
	display: flex;
	padding: 5px 0;
	.name {
		margin-right: 8px;
	}

	.type-filter {
		font-family: monospace;
	}

	.object .properties {
		padding-left: 16px;
	}
}
</style>
