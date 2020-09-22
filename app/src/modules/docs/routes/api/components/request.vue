<template>
	<div class="request">
		<div class="header">
			<v-select class="action" v-model="selectedAction" :items="actionOptions"></v-select>
			<v-input class="url" v-model="url"></v-input>
			<v-button @click="request" large>Send</v-button>
		</div>
		<v-tabs v-model="selectedTab">
			<!-- <v-tab>Querys</v-tab> -->
			<v-tab :disabled="hasRequestBody === false">Request Body</v-tab>
			<v-tab :disabled="hasRequestBody === false">Request Schema</v-tab>
			<v-tab>Response</v-tab>
			<v-tab>Response Schema</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab">
			<!-- <v-tab-item>
                <div class="from">
                    <div v-for="(query, i) in querys" :key="i">
                        
                    </div>
                </div>
            </v-tab-item> -->
			<v-tab-item>
				<interface-code v-model="requestBody" type="json" />
			</v-tab-item>
			<v-tab-item class="schema">
				<schema-component
					v-if="hasRequestBody"
					:schema="operation.requestBody.content['application/json'].schema"
				/>
			</v-tab-item>
			<v-tab-item>
				<interface-code v-model="response" type="json" />
				<div class="response-status" v-if="responseStatus">
					<span class="status" :class="{ success: [200, 202, 203].includes(responseStatus.status) }">
						{{ responseStatus.status }}
					</span>
					<span class="text">{{ responseStatus.statusText }}</span>
				</div>
			</v-tab-item>
			<v-tab-item class="schema">
				<div v-for="(response, status, i) in operation.responses" :key="i">
					<div class="title">
						<span class="status" :class="{ success: [200, 202, 203].includes(Number(status)) }">
							{{ status }}
						</span>
						<span class="description">{{ response.description }}</span>
					</div>
					<schema-component
						v-if="response && response.content && response.content['application/json']"
						:schema="response.content['application/json'].schema"
					/>
				</div>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from '@vue/composition-api';
import { OperationObject, ParameterObject, ResponseObject } from 'openapi3-ts';
import { PathItemKeys } from '../endpoints.vue';
import SchemaComponent from './schema.vue';
import api from '@/api';

export default defineComponent({
	components: { SchemaComponent },
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
		const selectedAction = ref<string | null>(props.action.toUpperCase());
		watch(
			() => props.action,
			(val) => (selectedAction.value = val.toUpperCase())
		);

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

		const selectedTab = ref([2]);
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

		const actionOptions = computed(() => {
			return Object.keys(PathItemKeys);
		});

		return {
			selectedAction,
			actionOptions,
			url,
			selectedTab,
			querys,
			hasRequestBody,
			request,
			response,
			requestBody,
			responseStatus,
		};

		async function request() {
			if (url.value === null || selectedAction.value === null) return;

			selectedTab.value = [2];
			let request;

			try {
				switch (selectedAction.value) {
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
	.header {
		display: flex;
		.action {
			display: block;
			width: 200px;
			margin-right: 20px;
		}

		.url {
			margin-right: 20px;
		}
	}

	.response-status {
		padding: 8px;
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

	.schema {
		padding: 10px 20px;
		background-color: var(--background-subdued);

		.title {
			margin: 10px 0 20px 0;
			font-size: 20px;

			.status {
				display: inline-block;
				margin-right: 12px;
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
}
</style>
