<template>
	<div class="request">
		<container title="REQUEST">
			<template slot="header">
				<div class="request-actions">
					<v-icon name="copy"></v-icon>
					<v-icon name="send" @click="request"></v-icon>
				</div>
			</template>
			{{ action.toUpperCase() }} {{ url }}
		</container>

		<template v-if="hasRequestBody">
			<container title="REQUEST BODY">
				<template slot="header">
					<v-icon name="code" @click="requestBodySchema = true"></v-icon>
				</template>
				An example request body
			</container>

			<v-modal v-model="requestBodySchema" title="Request Body">
				<schema :schema="operation.requestBody.content['application/json'].schema" />

				<template #footer>
					<v-button secondary @click="requestBodySchema = false">Close</v-button>
				</template>
			</v-modal>
		</template>

		<container title="RESPONSE">
			<template slot="header">
				<v-icon name="code" @click="responseSchema = true"></v-icon>
			</template>
			{ "Some example": "ww" }
		</container>

		<v-modal v-model="responseSchema" title="Response">
			<response v-for="(response, status, i) in operation.responses" :key="i" :data="response" :status="status" />

			<template #footer>
				<v-button secondary @click="responseSchema = false">Close</v-button>
			</template>
		</v-modal>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from '@vue/composition-api';
import { OperationObject, ParameterObject, ResponseObject } from 'openapi3-ts';
import { PathItemKeys } from '../endpoints.vue';
import api from '@/api';
import Container from './container.vue';

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
		const requestBodySchema = ref(false);
		const responseSchema = ref(false);

		const url = ref<string | null>(props.path);
		watch(
			() => props.path,
			(val) => (url.value = val)
		);

		watch(
			() => props.operation,
			(val) => {
				response.value = null;
				(responseStatus.value = null), (requestBody.value = null);
			}
		);

		const response = ref<Record<string, any> | null>(null);
		const responseStatus = ref<{ status: number; statusText: string } | null>(null);
		const requestBody = ref<Record<string, any> | null>(null);

		const hasRequestBody = computed(
			() =>
				props.operation.requestBody !== undefined &&
				'content' in props.operation.requestBody &&
				'application/json' in props.operation.requestBody.content
		);

		const querys = computed(() => props.parameter.filter((p) => p.in === 'query'));

		return {
			url,
			querys,
			hasRequestBody,
			request,
			response,
			requestBody,
			responseStatus,
			requestBodySchema,
			responseSchema,
		};

		async function request() {
			if (url.value === null || props.action === null) return;

			let request;

			try {
				switch (props.action) {
					case 'GET':
						request = await api.get(url.value);
						break;
					case 'POST':
						request = await api.post(url.value, requestBody.value);
						break;
					case 'PATCH':
						request = await api.patch(url.value, requestBody.value);
						break;
					case 'DELETE':
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

			if (request.data) response.value = request.data;
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
</style>
