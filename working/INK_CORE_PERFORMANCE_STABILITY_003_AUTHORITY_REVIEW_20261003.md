# Core performance stability 003 — Authority review — 2026-10-03

ACCEPTED_FOR_INTEGRATION / FORMAL_LIVE_PENDING

DEV candidate b7b4f95f4cec1e5827b537040f916556eeef9b98; authority browser candidate 28537865a90843b4176c103f09452177fedf2544.
One production file: PageSpatialIndex.syncObjects deduplicates target ids and uses existing rebuild above existing quadtree capacity. Small-batch incremental semantics preserved. Renderer, History, UI, FORMAT_VERSION unchanged; no second index/cache.

46 local focused/spatial/History/selection/package001/package002 checks PASS. Existing relocated spatial/History tests resolved through temporary qa/core/src symlink to production source; not a committed mutation.
Authority isolated Node24 7-trial controls also reproduced improvement: 3000 objects/100 targets median 73.983 -> 1.387 ms; 10000/13 median39.282 ->4.795 ms; 10000/250 median588.187 ->5.130 ms. These are isolated algorithm timings, not browser-frame performance claims.

Browser run 37109713821, request 5bc37fcf337d1433be067c4be44fd0681bfb0ade, artifact 11269475908, digest sha256:6d3d28ff3fbed1ac0f6ea1b07567aa9c51129e5e3c1e3ef2ebd95b8d0a347679: PASS. 16 native Paths via public CHAT create/align, one existing rebuild, zero per-object incremental updates, query/metadata parity against fresh native index; observable canvas change; Preview; exact geometry/pixel Undo/Redo PASS. 3000 native-path fixture objects,100 targets,20 cycles maintained3000 index items and fresh-query parity. No heap/leak claim;20 cycles is bounded repeated-operation coverage, not hour-long endurance.
Affected A1/A2/A3/A4/A5/B2/B4/C1/C3 regressions PASS; primary C2 align/distribute PASS. Latest-main intervening changes are QA/documentation only; product tree must remain byte-identical to browser candidate before deployment.
