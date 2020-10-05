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

		<template v-for="(reference, index) in objects">
			<div :key="index + 'object'" :id="`object-${reference.name}`" class="endpoint-info">
				<h2>The {{ reference.name }} Object</h2>
				<div v-if="reference.description" class="description">{{ reference.description }}</div>
				<div class="properties" v-for="(prop, name, i) in reference.schema.properties" :key="i">
					<schema
						:data="prop"
						:name="name"
						:required="reference.schema.required && reference.schema.required.includes(name)"
					/>
				</div>
			</div>
			<div class="container" :key="index + 'example-object'">
				<container class="example" title="EXAMPLE">
					<template #header>
						<v-icon name="copy" @click="copy(reference.example)" />
					</template>
					<pre class="example" v-html="reference.example" />
				</container>
			</div>
		</template>

		<template v-for="(data, index) in schema">
			<div class="endpoint-info" :key="index" :id="data.action + data.path">
				<div class="title">
					<div class="action" :class="{ [data.action]: true }">{{ data.action.toUpperCase() }}</div>
					<span class="path">{{ data.path }}</span>
				</div>
				<span class="description">{{ data.operation.description }}</span>
				<template v-if="data.parameters">
					<h3>Parameters</h3>
					<parameter v-for="(parameter, i) in data.parameters" :key="i" :data="parameter" />
				</template>

				<template v-if="data.attributes">
					<h3>Attributes</h3>
					<schema
						v-for="data in data.attributes"
						:key="data.name"
						:data="data.schema"
						:required="data.required"
						:name="data.name"
					/>
				</template>
			</div>

			<div class="container" :key="index + 'request'">
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
import { Section } from '../../components/sections';
import RequestComponent from './components/request.vue';
import { getExamplesString } from './components/example';
import Schema from './components/schema.vue';
import { getReference, getReferenceSections, dereference } from './components/reference';
import Container from './components/container.vue';
import { copy } from '@/utils/copy-to-clipboard';

import {
	PathItemObject,
	OperationObject,
	ParameterObject,
	ReferenceObject,
	ResponseObject,
	SchemaObject,
} from 'openapi3-ts';
import getOAS from '../../components/specs';

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
	attributes?: {
		name: string;
		required: boolean;
		schema: SchemaObject;
	}[];
}

export default defineComponent({
	components: { RequestComponent, Schema, Container },
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
		const openapi = getOAS()

		const schema = computed(() => {
			const schema: Data[] = [];
			if(openapi.value === null) return [];
			const paths = openapi.value.paths as Record<string, PathItemObject>;

			Object.entries(paths).forEach(([key, value]) => {
				Object.entries(value).forEach(([operationKey, operation]: [string, OperationObject]) => {
					if (Object.keys(PathItemKeys).includes(operationKey.toUpperCase()) === false) return;

					if (operation.tags && operation.tags.includes(props.section.name)) {
						const parameters: (ParameterObject | ReferenceObject)[] = [];

						if (value.parameters) parameters.push(...value.parameters);
						if (operation.parameters) parameters.push(...operation.parameters);

						const data: Data = {
							path: key,
							action: operationKey as PathItemKeys,
							operation,
						};

						if (parameters.length > 0) {
							data.parameters = parameters.map((param) =>
								'$ref' in param ? (getReference(param.$ref) as ParameterObject) : param
							);
						}

						if (
							operation.requestBody &&
							'content' in operation.requestBody &&
							'application/json' in operation.requestBody.content
						) {
							let schema = operation.requestBody.content['application/json'].schema;
							if (schema && '$ref' in schema) {
								schema = dereference(schema);
							}

							const required = schema?.required || [];

							if (schema && 'properties' in schema && schema.properties) {
								data.attributes = Object.entries(schema.properties).map(
									([name, prop]: [string, SchemaObject]) => {
										return {
											name,
											schema: prop,
											required: required.includes(name),
										};
									}
								);
							}
						}

						schema.push(data);
					}
				});
			});

			return schema;
		});

		const objects = computed(() => {
			if(openapi.value?.components?.schemas === undefined) return [];

			return Object.entries(openapi.value.components.schemas)
				.map(([name, schema]) => {
					if ('x-tag' in schema && schema['x-tag'] === props.section.name)
						return {
							name,
							link: `/docs/api-reference/${schema['x-tag']}`,
							example: getExamplesString(schema),
							schema,
						};
				})
				.filter((ref) => ref !== undefined);
		});

		return { schema, objects, copy };
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

.example {
	overflow: hidden;
	text-overflow: ellipsis;
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
	max-width: 1000px;

	@media (max-width: 800px) {
		display: flex;
		flex-direction: column;
	}

	.general {
		grid-column: span 2;

		@media (max-width: 800px) {
			grid-column: span 1;
		}
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

	.container {
		position: relative;

		.request,
		.container {
			position: sticky;
			top: 104px;
			margin: 40px 0;
		}
	}
}
</style>
