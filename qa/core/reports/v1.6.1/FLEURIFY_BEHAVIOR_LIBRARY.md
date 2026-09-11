# FLEURIFY_OUTLINE_FROM_CLOSED_PATH

- Input: one or more closed paths with ordered anchors.
- Preconditions: at least three anchors; cyclic previous/next indexing; finite percentage 0–200.
- Anchor invariant: anchor ID and x/y coordinates are unchanged.
- Handle calculation: incoming handle vector points toward the next anchor; outgoing handle vector points toward the previous anchor; vector magnitude is `percentage / 100` of the corresponding anchor delta.
- Parameters: `percentage` number, default 100, min 0, max 200, unit percent.
- Applicable geometry: closed polygonal or cubic paths.
- Failure conditions: open path, non-finite input, out-of-range input, missing target.
- Self-intersection risk: expected at larger percentages and concave contours.
- Composable behavior: outline generation, petal silhouette refinement, radial flower assembly, local handle restyling.
