<template>
	<div class="interface-markdown" :class="{ tabbed }">
		<div v-if="tabbed" class="toolbar">
			<v-tabs v-model="currentTab">
				<v-tab>
					<v-icon name="code" left />
					{{ $t('interfaces.markdown.edit') }}
				</v-tab>
				<v-tab>
					<v-icon name="visibility" outline left />
					{{ $t('interfaces.markdown.preview') }}
				</v-tab>
			</v-tabs>
		</div>
		<v-textarea
			v-show="showEdit"
			:placeholder="placeholder"
			:value="value"
			:disabled="disabled"
			@input="$listeners.input"
		/>
		<div v-show="showPreview" class="preview-container">
			<div class="preview" v-html="html"></div>
		</div>
	</div>
</template>

<script lang="ts">
import marked from 'marked';
import { defineComponent, computed, ref } from '@vue/composition-api';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: null,
		},
		tabbed: {
			type: Boolean,
			default: true,
		},
	},
	setup(props) {
		const currentTab = ref([0]);

		const html = computed(() => (props.value ? marked(props.value) : ''));
		const showEdit = computed(() => !props.tabbed || currentTab.value[0] === 0);
		const showPreview = computed(() => !props.tabbed || currentTab.value[0] !== 0);

		return { html, currentTab, showEdit, showPreview };
	},
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/markdown.scss';

.interface-markdown {
	--v-textarea-min-height: var(--input-height-tall);
	--v-textarea-max-height: 400px;
	--v-tab-background-color: var(--background-subdued);
	--v-tab-background-color-active: var(--background-subdued);

	display: flex;
	flex-wrap: wrap;

	.toolbar {
		width: 100%;
		height: 42px;
		background-color: var(--background-subdued);
		border: var(--border-width) solid var(--border-normal);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
	}

	.v-textarea {
		height: unset;
		min-height: var(--input-height-tall);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
	}

	.preview-container {
		min-height: var(--v-textarea-min-height);
		max-height: var(--v-textarea-max-height);
		padding: var(--input-padding);
		overflow-y: auto;
		border: var(--border-width) solid var(--border-normal);
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
	}

	.v-textarea,
	.preview-container {
		flex-basis: 100px;
		flex-grow: 1;
	}

	&:not(.tabbed) .preview-container {
		border-left: none;
	}

	&.tabbed .v-textarea {
		border-radius: 0 0 var(--border-radius) var(--border-radius);
	}

	&.tabbed .preview-container {
		border-radius: 0 0 var(--border-radius) var(--border-radius);
	}

	&.tabbed .toolbar {
		border-bottom: none;
	}
	&.tabbed .expand {
		right: 0;
	}
	&.tabbed.hasScrollbar .expand {
		right: 14px;
	}

	::v-deep {
		.preview {
			@include markdown;
		}
	}
}
</style>
