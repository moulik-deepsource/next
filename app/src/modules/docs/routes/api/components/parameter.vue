<template>
	<reference v-if="isReference" :reference="data.$ref" />
	<div v-else class="parameter">
		<div class="title">
			<span class="name">{{ data.name }}</span>
			<span class="required" :class="{ [data.required ? 'true' : 'false']: true }">
				{{ data.required ? 'REQUIRED' : 'OPTIONAL' }}
			</span>
		</div>
		<div class="description">{{ data.description }}</div>
		<schema :data="data.schema" />
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../../components/openapi.json';
import { ParameterObject } from 'openapi3-ts';

export default defineComponent({
	props: {
		data: {
			type: Object as PropType<ParameterObject>,
			default: null,
		},
	},
	setup(props) {
		const isReference = computed(() => props.data !== null && '$ref' in props.data);

		return { isReference };
	},
});
</script>

<style lang="scss" scoped>
.parameter {
	position: relative;
	padding: 16px 0;
	border-top: 2px solid var(--border-subdued);
	.title {
		.name {
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
	.schema {
		max-width: 100%;
	}
}
</style>
