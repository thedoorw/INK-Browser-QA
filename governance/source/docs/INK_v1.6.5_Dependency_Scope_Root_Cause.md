# INK v1.6.5 Dependency Scope Root Cause

## Confirmed failure

HERO-WC-01 Round 2 and Round 3 changed the correct visible objects, but the v1.6.4 formal Local Recompute report rejected the operation because nested Brush Composite descendants were represented by a coarse parent-to-constraint path. Geometry, material, style and semantic propagation shared an insufficiently differentiated start and edge model.

## Root cause

1. Parent geometry propagated only to a child constraint in the prior effective model and did not provide a complete deterministic path through three-level Brush Composite descendants.
2. Brush Material instances were not fully connected to generated render geometry, so material-driven procedural geometry could be classified outside the allowed scope.
3. Change intent did not formally select a domain before graph traversal.
4. Scope verification compared changed objects with a coarse allowed set, making unrelated siblings and necessary nested descendants difficult to distinguish.
5. Newly created descendants could be absent from a before-only dependency graph.

## Remediation

- Added seven explicit change domains.
- Added domain metadata to existing dependency edges.
- Added nested geometry, transform, hierarchy, semantic, style, material and material-generated render-geometry paths.
- Merged before/after graph state for deterministic handling of newly generated descendants.
- Added sibling and detached-instance exclusion evidence.
- Added deterministic recompute set hashes and reason traces.
- Added under-recompute, required-change and unaffected-preservation validation.

Document Format remains 4. Recipe Schema remains 1.0. No migration is required.
