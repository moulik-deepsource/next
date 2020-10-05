<template>
	<v-list nav>
		<navigation-item v-for="item in sections" :key="item.to" :section="item"></navigation-item>
	</v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { Section, Divider } from './sections';
import NavigationItem from './navigation-item.vue';

export default defineComponent({
	components: { NavigationItem },
	props: {
		sections: {
			type: Array as PropType<(Section | Divider)[] | null>
		}
	},
});
</script>
