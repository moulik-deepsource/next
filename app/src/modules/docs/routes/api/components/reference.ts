import { ComponentsObject, SchemaObject, ReferenceObject } from 'openapi3-ts';
import { cloneDeep, clone } from 'lodash';
import getOAS from '@/modules/docs/components/specs';

export function getReferenceSections(ref: string) {
	return ref.match(/^#\/components\/(.*?)\/(.*?)$/)?.slice(1);
}

export function getReference(ref: string): undefined | object {
	const openapi = getOAS()
	const sections = getReferenceSections(ref);
	if (sections === undefined || openapi.value === null) return undefined;
	const type = sections[0];
	const name = sections[1];

	return cloneDeep((openapi.value.components as ComponentsObject)[type][name]);
}

export function dereference(schema: SchemaObject | ReferenceObject, depth = 1) {
	let newSchema = clone(schema);

	if ('$ref' in newSchema) {
		depth -= 1;
		newSchema = getReference(newSchema.$ref) as SchemaObject;
	}

	if (newSchema.type === 'object' && newSchema.properties !== undefined) {
		const props: Record<string, any> = {};
		Object.entries(newSchema.properties).forEach(([key, value]) => {
			if (depth > 0) props[key] = dereference(value, depth);
		});
		if (depth > 0) newSchema.properties = props;
	} else if (newSchema.type === 'array' && newSchema.items !== undefined) {
		if (depth > 0) newSchema.items = dereference(newSchema.items, depth);
	}

	return newSchema;
}
