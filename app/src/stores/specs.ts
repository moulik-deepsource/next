import { createStore } from 'pinia';
import api from '@/api';
import {OpenAPIObject} from 'openapi3-ts' // import this later when the specs really match the OpenAPIObject.

export const useSpecsStore = createStore({
	id: 'specsStore',
	state: () => ({
		oas: null as OpenAPIObject | null,
	}),
	actions: {
		async getOAS() {
			if( this.state.oas) return this.state.oas

			const response = await api.get('/server/specs/oas');

			try {
				this.state.oas = JSON.parse(response.data);
			} catch (exception) {
				return null
			}
			return this.state.oas
		},
	},
});
