<template>
	<div class="schema">
		<div class="title" v-if="name !== null">
			<span class="name">{{ name }}</span>
			<span class="required" :class="{ [required ? 'true' : 'false']: true }">
				{{ required ? 'REQUIRED' : 'OPTIONAL' }}
			</span>
		</div>
		<div v-if="typeFiler" class="type-filter">{{ typeFiler }}</div>
		<ul class="types">
			<li class="type" v-for="(type, index) in types" :key="index">
				<span class="data-type" v-if="type.type">{{ type.type }}</span>

				<template v-if="'$ref' in type">
					<router-link class="object-link" :to="refToLink(type.$ref)">
						{{ type.$ref.split('/').pop() }}
					</router-link>
				</template>

				<template v-else-if="type.type === 'object'">
					<div v-if="type.properties" class="properties">
						<schema
							v-for="(val, key) in type.properties"
							:key="key"
							:data="val"
							:name="key"
							:required="type.required && type.required.includes(key)"
						></schema>
					</div>
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
					<div class="items">
						<span>items:</span>
						<schema :data="type.items" name="items"></schema>
					</div>
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
				<!-- <span v-if="type.example" class="example">
					<br />
					example: {{ type.example }}
				</span> -->
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import { SchemaObject, ReferenceObject } from 'openapi3-ts';
import { getReference, getReferenceSections } from './reference';

export default defineComponent({
	name: 'schema',
	props: {
		name: {
			type: String,
			default: null,
		},
		required: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object as PropType<SchemaObject | ReferenceObject>,
			default: null,
		},
	},
	setup(props) {
		const typeFiler = ref<'oneOf' | 'anyOf' | 'allOf' | null>(null);

		const types = computed(() => {
			const types: SchemaObject[] = [];
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
			} else if (props.data.$ref !== undefined) {
				typeFiler.value = null;
				types.push(schema);
			}

			return types;
		});

		return { types, typeFiler, refToLink };

		function refToLink(ref: string) {
			const sections = getReferenceSections(ref);
			const schema = getReference(ref) as { 'x-tag': string } | undefined;
			if (sections !== undefined && schema !== undefined && 'x-tag' in schema) {
				const tag = schema['x-tag'].replaceAll(' ', '-').toLowerCase();
				return `/docs/api-reference/endpoints/${tag}#object-${sections[1]}`;
			}
			return null;
		}
	},
});
</script>

<style lang="scss" scoped>
.schema {
	padding: 16px 0;
	border-top: 2px solid var(--border-subdued);

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

	.title {
		.name {
			color: var(--foreground-normal);
			font-weight: bold;
			font-size: 16px;
			font-family: monospace;
		}

		.required {
			display: inline-block;
			margin: 0px 8px;
			font-size: 12px;

			&.true {
				color: var(--warning);
			}

			&.false {
				color: var(--foreground-subdued);
			}
		}
	}

	.types {
		overflow: hidden;
		.type {
			&:not(:last-child) {
				margin-bottom: 4px;
			}
		}
	}

	.properties,
	.items {
		padding-left: 20px;
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

	.object-link {
		color: var(--primary);
	}
}
</style>
