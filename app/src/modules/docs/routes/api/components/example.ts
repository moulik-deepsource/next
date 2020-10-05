import { SchemaObject } from 'openapi3-ts';

export function getExamplesString(schema: SchemaObject) {
	return JSON.stringify(getExamples(schema), null, 4);
}

export function getExamples(schema: SchemaObject) {
	if (schema.properties === undefined) return {};
	return filterExamples(schema.properties);
}

function filterExamples(schema: Record<string, SchemaObject>) {
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
