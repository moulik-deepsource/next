<template>
	<div class="endpoints">
		<div class="general">
			<h1>{{ section.name }}</h1>
			<div class="subtitle" v-if="section.description">{{ section.description }}</div>
			<h2>Endpoints</h2>
			<table class="paths">
				<tr>
					<th>Path</th>
					<th>Description</th>
				</tr>
				<a v-for="(data, index) in schema" :key="index" :href="`#${data.action + data.path}`">
					<td class="path" nowrap>
						<span class="action" :class="{ [data.action]: true }">{{ data.action.toUpperCase() }}</span>
						{{ data.path }}
					</td>
					<td class="description">{{ data.operation.description }}</td>
				</a>
			</table>
		</div>

		<template v-for="(data, index) in schema">
			<div class="endpoint-info" :key="index" :id="data.action + data.path">
				<div class="title">
					<div class="action" :class="{ [data.action]: true }">{{ data.action.toUpperCase() }}</div>
					<span class="path">{{ data.path }}</span>
				</div>
				<span class="description">{{ data.operation.description }}</span>
				<h3>Parameters</h3>
				<parameter v-for="(parameter, i) in data.parameters" :key="i" :data="parameter" />
			</div>
			<div class="request-container" :key="index + 'request'">
				<request-component
					:action="data.action"
					:operation="data.operation"
					:path="data.path"
					:parameter="data.parameter"
				/>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import openapi from '../../components/openapi.json';
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
	margin: 16px 0 16px 0;
	font-size: 24px;
}

.subtitle {
	max-width: 750px;
	margin-bottom: 32px;
	font-size: 16px;
}

h2 {
	margin: 16px 0;
	font-size: 20px;
}

h3 {
	margin: 16px 0;
	font-size: 20px;
}

.action {
	.get,
	&.get {
		color: var(--success);
		background-color: var(--success);
	}
	.post,
	&.post {
		color: var(--primary);
		background-color: var(--primary);
	}
	.patch,
	&.patch {
		color: var(--warning);
		background-color: var(--warning);
	}
	.delete,
	&.delete {
		color: var(--danger);
		background-color: var(--danger);
	}
}

.endpoints {
	display: grid;
	grid-template-columns: 1fr 350px;

	.general {
		grid-column: span 2;
	}

	.paths {
		margin-bottom: 40px;
		border-spacing: 0;

		a {
			display: table-row;
			overflow: hidden;
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
			text-overflow: ellipsis;
		}

		.action {
			width: min-content;
			margin-right: 4px;
			font-weight: 600;
			background-color: unset;
			border-radius: var(--border-radius);
		}

		.path {
			font-size: 16px;
		}

		.description {
			color: var(--foreground-normal-alt);
		}
	}

	.endpoint-info {
		padding-right: 32px;

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
	}

	.request-container {
		position: relative;

		.request {
			position: sticky;
			top: 104px;
			margin: 40px 0;
		}
	}
}
</style>
