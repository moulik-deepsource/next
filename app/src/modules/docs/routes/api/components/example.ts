import { ReferenceObject, SchemaObject, SchemasObject } from 'openapi3-ts';
import { getReference } from './reference';

export function getExamplesString(schema: SchemaObject | ReferenceObject) {
	return JSON.stringify(getExamples(schema), null, 4);
}

export function getExamples(schema: SchemaObject | ReferenceObject) {
	if (schema === null) return null;
	if ('$ref' in schema) {
		schema = getReference(schema.$ref) as SchemaObject;
	}
	if (schema.properties === undefined) return null;
	return filterExamples(schema.properties);
}

function filterExamples(schema: SchemaObject | ReferenceObject) {
	const obj: Record<string, string | Record<string, any>> = {};

	Object.entries(schema).forEach(([key, value]) => {
		if ('$ref' === key) return;

		if (value.type === 'object' && value.properties !== undefined && value.example === undefined) {
			obj[key] = filterExamples(value.properties);
		} else if (value.type === 'array' && value.items !== undefined && value.example === undefined) {
			obj[key] = [filterExamples(value)];
		} else if (value.example !== undefined) {
			obj[key] = value.example;
		}
	});

	return obj;
}
