import api from '@/api';
import {OpenAPIObject} from 'openapi3-ts' // import this later when the specs really match the OpenAPIObject.
import { ref } from '@vue/composition-api';

let oas = ref<OpenAPIObject | null>(null)

function getOAS() {
	if(oas.value === null) {
		api.get('/server/specs/oas').then((response) => {
			try {
				oas.value = response.data
			} catch (exception) {
			}
		})
	}
	return oas
}

export default getOAS;