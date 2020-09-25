<template>
	<reference v-if="isReference" :reference="data.$ref" />
	<div v-else class="schema">
		<div v-if="typeFiler" class="type-filter">{{ typeFiler }}</div>
		<ul class="types">
			<li class="type" v-for="(type, index) in types" :key="index">
				<span class="data-type">{{ type.type }}</span>

				<template v-if="type.type === 'object'">
					<table v-if="type.properties" class="properties">
						<tr v-for="(val, key) in type.properties" :key="key">
							<td v-if="key" class="name">{{ key }}</td>
							<td><schema :data="val"></schema></td>
						</tr>
					</table>
					<span v-if="type.required">
						<br />
						required: {{ type.required.join(', ') }}
					</span>
					<span v-if="type.minProperties">
						<br />
						min properties: {{ type.minProperties }}
					</span>
					<span v-if="type.maxProperties">
						<br />
						max properties: {{ type.maxProperties }}
					</span>
				</template>

				<template v-else-if="type.type === 'array'">
					<table>
						<tr>
							<td class="name">items:</td>
							<td><schema :data="type.items" name="items"></schema></td>
						</tr>
					</table>
					<span v-if="type.minItems">
						<br />
						min size: {{ type.minItems }}
					</span>
					<span v-if="type.maxItems">
						<br />
						max size: {{ type.maxItems }}
					</span>
					<span v-if="type.uniqueItems">
						<br />
						items must be unique
					</span>
				</template>

				<template v-else-if="type.type === 'string'">
					<span v-if="type.format">{{ type.format }}</span>
					<span v-if="type.enum">
						<br />
						enum: {{ type.enum.join(', ') }}
					</span>
					<span class="pattern" v-if="type.pattern">
						<br />
						pattern: {{ type.pattern }}
					</span>
				</template>

				<template v-else-if="type.type === 'number' || type.type === 'integer'">
					<span v-if="type.format">{{ type.format }}</span>
					<span v-if="type.minimum">
						<br />
						minimum: {{ type.minimum }}
					</span>
					<span v-if="type.maximum">
						<br />
						maximum: {{ type.maximum }}
					</span>
					<span v-if="type.multipleOf">
						<br />
						multipleOf: {{ type.multipleOf }}
					</span>
				</template>

				<span v-if="type.description" class="description">
					<br />
					{{ type.description }}
				</span>

				<span v-if="type.nullable" class="nullable">
					<br />
					nullable
				</span>
				<span v-if="type.example" class="example">
					<br />
					example: {{ type.example }}
				</span>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import { SchemaObject, ReferenceObject } from 'openapi3-ts';

export default defineComponent({
	name: 'schema',
	props: {
		name: {
			type: String,
			default: null,
		},
		data: {
			type: Object as PropType<SchemaObject | ReferenceObject>,
			default: null,
		},
	},
	setup(props) {
		const typeFiler = ref<'oneOf' | 'anyOf' | 'allOf' | null>(null);

		const isReference = computed(() => props.data !== null && '$ref' in props.data);

		const types = computed(() => {
			const types: SchemaObject[] = [];
			if (isReference.value) return;
			const schema = props.data as SchemaObject;

			if (schema.type !== undefined) {
				typeFiler.value = null;
				types.push(schema);
			} else if (schema.oneOf) {
				typeFiler.value = 'oneOf';
				types.push(...schema.oneOf);
			} else if (schema.anyOf) {
				typeFiler.value = 'anyOf';
				types.push(...schema.anyOf);
			} else if (schema.allOf) {
				typeFiler.value = 'allOf';
				types.push(...schema.allOf);
			}

			return types;
		});

		return { types, typeFiler, isReference };
	},
});
</script>

<style lang="scss" scoped>
.schema {
	display: flex;
	& * {
		user-select: text;
	}

	.type-filter {
		margin-right: 8px;
		font-family: monospace;
	}

	ul {
		padding-left: 0px;
		list-style-type: none;
	}

	.types {
		overflow: hidden;
		.type {
			&:not(:last-child) {
				margin-bottom: 4px;
			}
		}
	}

	.type table {
		tr {
			td {
				padding: 4px 0;
				vertical-align: top;

				&.name {
					padding-right: 12px;
					font-size: 16px;
				}
			}
		}
	}

	span {
		color: var(--foreground-subdued);

		&.data-type {
			color: var(--primary);
		}

		&.description {
			color: var(--foreground-normal);
		}

		&.pattern {
			word-break: break-all;
		}
	}
}
</style>
