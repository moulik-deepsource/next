import openapi from '../../../components/openapi.json';
import { ComponentsObject, SchemaObject, ReferenceObject } from 'openapi3-ts';
import { clone } from 'lodash';

export function getReferenceSections(ref: string) {
	return ref.match(/^#\/components\/(.*?)\/(.*?)$/)?.slice(1);
}

export function getReference(ref: string): undefined | object {
	const sections = getReferenceSections(ref);
	if (sections === undefined) return undefined;
	const type = sections[0];
	const name = sections[1];
	return (openapi.components as ComponentsObject)[type][name];
}

export function dereference(schema: SchemaObject | ReferenceObject) {
	let newSchema = clone(schema);
	if ('$ref' in newSchema) newSchema = getReference(newSchema.$ref) as SchemaObject;

	if (newSchema.type === 'object' && newSchema.properties !== undefined) {
		const props: Record<string, any> = {};
		Object.entries(newSchema.properties).forEach(([key, value]) => {
			props[key] = dereference(value);
		});
		newSchema.properties = props;
	} else if (newSchema.type === 'array' && newSchema.items !== undefined) {
		newSchema.items = dereference(newSchema.items);
	}

	return newSchema;
}
