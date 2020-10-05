<template>
	<div v-if="openapi">
		<h1>General Information</h1>
		<h2>
			{{ openapi.info.title }}
			<span class="version">v{{ openapi.info.version }}</span>
			<span class="version">OAS v{{ openapi.openapi }}</span>
		</h2>
		<span>{{ openapi.info.description }}</span>
		<h3>Contact</h3>
		<a v-if="openapi.info.contact.url" target="_blank" :href="openapi.info.contact.url">
			{{ openapi.info.contact.name }}
		</a>
		<a v-if="openapi.info.contact.email" :href="`mailto:${openapi.info.contact.email}`">Email</a>
		<template v-if="openapi.info.license">
			<h3>License</h3>
			<a :href="openapi.info.license.url" target="_blank">{{ openapi.info.license.name }}</a>
		</template>
		<template v-if="openapi.info.externalDocs">
			<h3>External Documentation</h3>
			<a :href="openapi.info.externalDocs.url" target="_blank">{{ openapi.info.externalDocs.description }}</a>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/composition-api';
import getOAS from '../../components/specs';

export default defineComponent({
	components: {},
	setup() {
		const openapi = getOAS()
		return { openapi };
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

h3 {
	margin: 8px 0;
	font-size: 16px;
}

a {
	color: var(--primary);

	&:hover {
		text-decoration: underline;
	}
}

.version {
	display: inline-block;
	margin-left: 8px;
	padding: 0px 8px;
	color: var(--foreground-inverted);
	font-size: 12px;
	vertical-align: top;
	background-color: var(--primary);
	border-radius: var(--border-radius);
}
</style>
