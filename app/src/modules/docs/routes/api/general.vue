<template>
	<div>General information</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { Section } from '../../components/sections';

export default defineComponent({
	components: {},
	props: {
		section: {
			type: Object as PropType<Section>,
		},
		page: {
			type: String,
			default: null,
		},
	},
});
</script>
