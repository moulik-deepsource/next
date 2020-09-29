<template>
	<div class="request">
		<container title="REQUEST">
			<template slot="header">
				<div class="request-actions">
					<v-icon name="copy" @click="copy(action.toUpperCase() + ' ' + url)"></v-icon>
					<v-icon name="send" @click="request"></v-icon>
				</div>
			</template>
			<span>{{ action.toUpperCase() }}</span>
			<span contenteditable v-once v-html="url" @input="url = $event.target.innerHTML"></span>
		</container>

		<template v-if="requestBody !== null">
			<container title="REQUEST BODY">
				<template slot="header">
					<v-icon name="copy" @click="copy(requestBody)"></v-icon>
				</template>
				<pre
					class="example"
					v-once
					@input="requestBody = $event.target.innerHTML"
					contenteditable
					v-html="requestBody"
				></pre>
			</container>
		</template>

		<container title="RESPONSE">
			<template slot="header">
				<div class="response-header">
					<v-icon name="copy" @click="copy(response)"></v-icon>
					<span
						class="response-status"
						:class="{ success: [200, 203].includes(Number(responseStatus.status)) }"
						v-if="responseStatus"
					>
						{{ responseStatus.status }} {{ responseStatus.statusText }}
					</span>
				</div>
			</template>
			<pre class="example">{{ response }}</pre>
		</container>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from '@vue/composition-api';
import { OperationObject, ParameterObject, ResponseObject } from 'openapi3-ts';
import { PathItemKeys } from '../endpoints.vue';
import api from '@/api';
import Container from './container.vue';
import { getExamplesString } from './example';
import { dereference } from './reference';
import { copy } from '@/utils/copy-to-clipboard';

export default defineComponent({
	components: { Container },
	props: {
		operation: {
			type: Object as PropType<OperationObject>,
			default: null,
		},
		action: {
			type: String,
			default: null,
			validator: (val: string) => val !== null && Object.keys(PathItemKeys).includes(val.toUpperCase()),
		},
		path: {
			type: String,
			default: null,
		},
		parameter: {
			type: Array as PropType<ParameterObject[]>,
			default: () => [],
		},
	},
	setup(props) {
		const url = ref<string | null>(props.path);
		watch(
			() => props.path,
			(val) => (url.value = val)
		);

		watch(
			() => props.operation,
			(val) => {
				_response.value = null;
				responseStatus.value = null;
				_requestBody.value = null;
			}
		);

		const _response = ref<Record<string, any> | null>(null);
		const responseStatus = ref<{ status: number; statusText: string } | null>(null);
		const _requestBody = ref<Record<string, any> | null>(null);

		const response = computed(() => {
			if (_response.value !== null) return _response.value;
			if (
				'200' in props.operation.responses &&
				props.operation.responses['200'].content &&
				'application/json' in props.operation.responses['200'].content
			) {
				const schema = props.operation.responses['200'].content['application/json'].schema;
				return getExamplesString(dereference(schema));
			}
			return null;
		});

		const requestBody = computed({
			get() {
				if (_requestBody.value !== null) return JSON.stringify(_requestBody.value, null, 4);

				if (
					props.operation.requestBody &&
					'content' in props.operation.requestBody &&
					'application/json' in props.operation.requestBody.content &&
					props.operation.requestBody.content['application/json'].schema
				) {
					const schema = props.operation.requestBody.content['application/json'].schema;
					return getExamplesString(schema);
				}
				return null;
			},
			set(val: string | null) {
				if (val === null) return;
				_requestBody.value = JSON.parse(val);
			},
		});

		const querys = computed(() => props.parameter.filter((p) => p.in === 'query'));

		return {
			url,
			querys,
			request,
			response,
			requestBody,
			responseStatus,
			getExamplesString,
			copy,
		};

		async function request() {
			if (url.value === null || props.action === null) return;

			let request;

			try {
				switch (props.action) {
					case 'get':
						request = await api.get(url.value);
						break;
					case 'post':
						request = await api.post(url.value, requestBody.value);
						break;
					case 'patch':
						request = await api.patch(url.value, requestBody.value);
						break;
					case 'delete':
						request = await api.delete(url.value);
						break;
					default:
						break;
				}
			} catch (error) {
				if (error.response === undefined) return;
				if (error.response.status)
					responseStatus.value = { status: error.response.status, statusText: error.response.statusText };
			}
			if (request === undefined) return;

			if (request.data) _response.value = request.data;
			if (request.status) responseStatus.value = { status: request.status, statusText: request.statusText };
		}
	},
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/form-grid.scss';

.request {
	.container {
		margin-bottom: 16px;
	}
}

.example {
	overflow: hidden;
	text-overflow: ellipsis;
}
.response-header {
	display: flex;
	flex: 1;
	flex-direction: row-reverse;
	align-items: center;
	justify-content: space-between;

	.response-status {
		display: inline-block;
		padding: 0 4px;
		color: var(--foreground-inverted);
		background-color: var(--danger);
		border-radius: var(--border-radius);

		&.success {
			background-color: var(--primary);
		}
	}
}
</style>
