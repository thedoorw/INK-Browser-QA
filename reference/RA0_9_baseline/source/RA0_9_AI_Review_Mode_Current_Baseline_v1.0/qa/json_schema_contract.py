"""Dependency-free JSON Schema subset used by the RA package contracts."""

from __future__ import annotations

import json
import math
import re
from dataclasses import dataclass
from typing import Any, Iterable


@dataclass
class ValidationError:
    path: tuple[object, ...]
    message: str

    def __str__(self) -> str:
        location = "/".join(map(str, self.path)) or "$"
        return f"{location}: {self.message}"


class Draft202012Validator:
    def __init__(self, schema: dict[str, Any]) -> None:
        self.schema = schema

    def iter_errors(self, instance: Any) -> Iterable[ValidationError]:
        return iter(self._validate(instance, self.schema, ()))

    def _resolve_ref(self, ref: str) -> dict[str, Any]:
        if not ref.startswith("#/"):
            raise ValueError(f"Only local schema references are supported: {ref}")
        target: Any = self.schema
        for part in ref[2:].split("/"):
            target = target[part.replace("~1", "/").replace("~0", "~")]
        return target

    def _validate(
        self, instance: Any, schema: dict[str, Any], path: tuple[object, ...]
    ) -> list[ValidationError]:
        errors: list[ValidationError] = []
        if "$ref" in schema:
            return self._validate(instance, self._resolve_ref(schema["$ref"]), path)

        if "allOf" in schema:
            for branch in schema["allOf"]:
                errors.extend(self._validate(instance, branch, path))
        if "anyOf" in schema and not any(
            not self._validate(instance, branch, path) for branch in schema["anyOf"]
        ):
            errors.append(ValidationError(path, "does not match anyOf"))
        if "oneOf" in schema:
            matches = sum(
                not self._validate(instance, branch, path) for branch in schema["oneOf"]
            )
            if matches != 1:
                errors.append(ValidationError(path, f"matches {matches} oneOf branches"))

        expected = schema.get("type")
        if expected is not None and not self._is_type(instance, expected):
            return errors + [ValidationError(path, f"expected type {expected}")]

        if "const" in schema and instance != schema["const"]:
            errors.append(ValidationError(path, f"expected const {schema['const']!r}"))
        if "enum" in schema and instance not in schema["enum"]:
            errors.append(ValidationError(path, "value is not in enum"))

        if isinstance(instance, dict):
            required = schema.get("required", [])
            for key in required:
                if key not in instance:
                    errors.append(ValidationError(path + (key,), "required property missing"))
            properties = schema.get("properties", {})
            for key, value in instance.items():
                if key in properties:
                    errors.extend(self._validate(value, properties[key], path + (key,)))
                elif schema.get("additionalProperties") is False:
                    errors.append(
                        ValidationError(path + (key,), "additional property is not allowed")
                    )

        if isinstance(instance, list):
            if len(instance) < schema.get("minItems", 0):
                errors.append(ValidationError(path, "array shorter than minItems"))
            if schema.get("uniqueItems"):
                encoded = [json.dumps(x, sort_keys=True, ensure_ascii=False) for x in instance]
                if len(encoded) != len(set(encoded)):
                    errors.append(ValidationError(path, "array items are not unique"))
            item_schema = schema.get("items")
            if isinstance(item_schema, dict):
                for index, value in enumerate(instance):
                    errors.extend(self._validate(value, item_schema, path + (index,)))

        if isinstance(instance, str):
            if len(instance) < schema.get("minLength", 0):
                errors.append(ValidationError(path, "string shorter than minLength"))
            if "pattern" in schema and re.search(schema["pattern"], instance) is None:
                errors.append(ValidationError(path, "string does not match pattern"))

        if isinstance(instance, (int, float)) and not isinstance(instance, bool):
            if not math.isfinite(float(instance)):
                errors.append(ValidationError(path, "number is not finite"))
            if "minimum" in schema and instance < schema["minimum"]:
                errors.append(ValidationError(path, "number is below minimum"))
            if "maximum" in schema and instance > schema["maximum"]:
                errors.append(ValidationError(path, "number is above maximum"))

        if "not" in schema and not self._validate(instance, schema["not"], path):
            errors.append(ValidationError(path, "matches forbidden schema"))
        return errors

    @staticmethod
    def _is_type(instance: Any, expected: str | list[str]) -> bool:
        if isinstance(expected, list):
            return any(Draft202012Validator._is_type(instance, item) for item in expected)
        checks = {
            "object": lambda value: isinstance(value, dict),
            "array": lambda value: isinstance(value, list),
            "string": lambda value: isinstance(value, str),
            "number": lambda value: isinstance(value, (int, float))
            and not isinstance(value, bool),
            "integer": lambda value: isinstance(value, int) and not isinstance(value, bool),
            "boolean": lambda value: isinstance(value, bool),
            "null": lambda value: value is None,
        }
        return checks.get(expected, lambda _value: True)(instance)
