<template>
	<div class="endpoints">
		<div class="endpoint" v-for="(data, index) in schema" :key="index">
			<div class="path">Path: {{ data.path }}</div>
			<div class="action">{{ data.action.toUpperCase() }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../components/openapi-deref.json';
import { Section } from '../../components/sections';
import { PathItemObject, OperationObject } from 'openapi3-ts';

enum PathItemKeys {
	GET = 'get',
	PUT = 'put',
	POST = 'post',
	DELETE = 'delete',
	OPTIONS = 'options',
	HEAD = 'head',
	PATCH = 'patch',
	TRACE = 'trace',
}

export default defineComponent({
	components: {},
	props: {
		section: {
			type: Object as PropType<Section>,
			default: null,
		},
		page: {
			type: String,
			default: null,
		},
	},
	setup(props) {
		const schema = computed(() => {
			const schema: { path: string; action: PathItemKeys; operation: OperationObject }[] = [];
			const paths = openapi.paths as Record<string, PathItemObject>;

			Object.entries(paths).forEach(([key, value]) => {
				Object.entries(value).forEach(([operationKey, operation]) => {
					if (Object.keys(PathItemKeys).includes(operationKey.toUpperCase()) === false) return;

					if (operation.tags && operation.tags.includes(props.section.name)) {
						schema.push({ path: key, action: operationKey as PathItemKeys, operation });
					}
				});
			});

			return schema;
		});

		return { schema };
	},
});
</script>

<style lang="scss" scoped>
.endpoints {
	.endpoint {
		display: flex;
		padding: 20px 0 50px 0;
		font-size: 20px;

		.path {
			margin-right: 20px;
		}
	}
}
</style>
