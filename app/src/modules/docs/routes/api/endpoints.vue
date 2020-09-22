<template>
	<div class="endpoints">
		<h1>{{ section.name }}</h1>
		<h2>All endpoints</h2>
		<table class="paths">
			<tr>
				<th>Action</th>
				<th>Path</th>
				<th>Description</th>
			</tr>
			<a v-for="(data, index) in schema" :key="index" :href="`#${data.action + data.path}`">
				<td class="action">
					<div :class="{ [data.action]: true }">{{ data.action.toUpperCase() }}</div>
				</td>
				<td class="path" nowrap>{{ data.path }}</td>
				<td class="description">{{ data.operation.description }}</td>
			</a>
		</table>

		<div class="endpoint">
			<div class="endpoint-item" v-for="(data, index) in schema" :key="index" :id="data.action + data.path">
				<div class="title">
					<div class="action" :class="{ [data.action]: true }">{{ data.action.toUpperCase() }}</div>
					<span class="path">{{ data.path }}</span>
				</div>
				<table v-if="data.parameters" class="parameters">
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Schema</th>
						<th>Description</th>
					</tr>
					<tr class="parameter" v-for="(param, i) in data.parameters" :key="i">
						<td
							class="name"
							:class="{ required: param.required }"
							v-tooltip.left="param.required ? 'This is required' : null"
						>
							{{ param.name }}
						</td>
						<td class="in">{{ param.in }}</td>
						<td><schema-component :schema="param.schema" /></td>
						<td class="description">{{ param.description }}</td>
					</tr>
				</table>
				<request-component
					:action="data.action"
					:operation="data.operation"
					:path="data.path"
					:parameter="data.parameter"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../components/openapi-deref.json';
import { Section } from '../../components/sections';
import RequestComponent from './components/request.vue';
import SchemaComponent from './components/schema.vue';
import { PathItemObject, OperationObject, ParameterObject, ReferenceObject } from 'openapi3-ts';

export enum PathItemKeys {
	GET = 'get',
	PUT = 'put',
	POST = 'post',
	DELETE = 'delete',
	OPTIONS = 'options',
	HEAD = 'head',
	PATCH = 'patch',
	TRACE = 'trace',
}

interface Data {
	path: string;
	action: PathItemKeys;
	operation: OperationObject;
	parameters?: ParameterObject[];
}

export default defineComponent({
	components: { RequestComponent, SchemaComponent },
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
			const schema: Data[] = [];
			const paths = openapi.paths as Record<string, PathItemObject>;

			Object.entries(paths).forEach(([key, value]) => {
				Object.entries(value).forEach(([operationKey, operation]: [string, OperationObject]) => {
					if (Object.keys(PathItemKeys).includes(operationKey.toUpperCase()) === false) return;

					if (operation.tags && operation.tags.includes(props.section.name)) {
						const parameters: ParameterObject[] = [];

						if (value.parameters) {
							parameters.push(...(value.parameters as ParameterObject[]));
						}

						if (operation.parameters) {
							parameters.push(...(operation.parameters as ParameterObject[]));
						}

						const data: Data = {
							path: key,
							action: operationKey as PathItemKeys,
							operation,
						};

						if (parameters !== undefined && parameters.length > 0) data.parameters = parameters;

						schema.push(data);
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
h1 {
	margin: 16px 0 32px 0;
	font-size: 24px;
}

h2 {
	margin: 16px 0;
	font-size: 20px;
}

.action {
	.get,
	&.get {
		background-color: var(--success);
	}
	.post,
	&.post {
		background-color: var(--primary);
	}
	.patch,
	&.patch {
		background-color: var(--warning);
	}
	.delete,
	&.delete {
		background-color: var(--danger);
	}
}

.endpoints {
	.paths {
		margin-bottom: 40px;
		border-spacing: 0;

		a {
			display: table-row;
			border-radius: var(--border-radius);
			cursor: pointer;
			&:hover {
				background-color: var(--background-subdued);
			}
		}

		th {
			color: var(--foreground-subdued);
			text-align: start;
		}

		td {
			padding: 8px;
		}

		.action {
			text-align: end;
		}

		.action div {
			display: inline-block;
			width: min-content;
			padding: 0 8px;
			color: var(--foreground-inverted);
			border-radius: var(--border-radius);
		}

		.path {
			font-size: 16px;
		}

		.description {
			color: var(--foreground-normal-alt);
		}
	}

	.endpoint-item {
		.title {
			display: flex;
			align-items: center;
			padding: 40px 0 20px 0;
			font-size: 20px;

			.action {
				margin-right: 8px;
				padding: 4px 8px;
				color: var(--foreground-inverted);
				border-radius: var(--border-radius);
			}

			.path {
				margin-right: 20px;
			}
		}

		.parameters {
			border-spacing: 0;

			th {
				padding: 0 8px;
				color: var(--foreground-subdued);
				text-align: start;
			}

			td {
				vertical-align: top;
			}

			.parameter {
				font-size: 16px;

				td {
					padding: 4px 8px;
				}

				.name.required::after {
					color: var(--primary);
					content: '*';
				}

				.in {
					color: var(--foreground-subdued);
				}

				.schema {
					max-width: 200px;
				}

				.description {
					font-size: 14px;
				}
			}
		}
	}

	.request {
		margin: 40px 0;
	}
}
</style>
