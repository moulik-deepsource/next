s
<template>
	<reference v-if="isReference" :reference="data.$ref" :status="status" />
	<div v-else class="response">
		<div class="title">
			<span v-if="status" class="status" :class="{ success: [200, 202, 203].includes(Number(status)) }">
				{{ status }}
			</span>
			<span v-if="data.description" class="description">{{ data.description }}</span>
		</div>

		<div v-for="(schema, type) in data.content" :key="type">
			<schema :data="schema.schema" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { ResponseObject, ReferenceObject } from 'openapi3-ts';

export default defineComponent({
	props: {
		data: {
			type: Object as PropType<ResponseObject | ReferenceObject>,
			default: null,
		},
		status: {
			type: String,
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
.response {
	.title {
		font-size: 16px;
		.status {
			display: inline-block;
			margin-right: 8px;
			padding: 4px 8px;
			color: var(--foreground-inverted);
			background-color: var(--danger);
			border-radius: var(--border-radius);

			&.success {
				background-color: var(--primary);
			}
		}
	}
}
</style>
