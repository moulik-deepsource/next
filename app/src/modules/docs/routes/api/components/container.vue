<template>
	<div class="container">
		<div class="header">
			<span class="title">{{ title }}</span>
			<slot name="header" />
		</div>
		<div class="body"><slot /></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { SchemaObject, SchemasObject } from 'openapi3-ts';

export default defineComponent({
	props: {
		title: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
.container {
	border: 2px solid var(--border-subdued);
	border-radius: var(--border-radius);

	.header {
		display: flex;
		justify-content: space-between;
		padding: 8px 16px;
		color: var(--foreground-subdued);
		background-color: var(--background-subdued);
		border-bottom: 2px solid var(--border-subdued);

		.title {
			margin-right: 8px;
		}
	}

	.body {
		padding: 8px 16px;
	}
}
</style>
