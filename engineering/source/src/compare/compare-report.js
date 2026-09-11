export function compareReportMarkdown(report) {
  const semantic = report.semanticDifference, metrics = report.imageDifference;
  return `# INK Preview Compare\n\n- Status: \`${report.status}\`\n- Preserved: ${semantic.preserved.length}\n- Modified: ${semantic.modified.length}\n- Added: ${semantic.added.length}\n- Deleted: ${semantic.deleted.length}\n- Undeclared changes: ${semantic.undeclaredChanges.length}\n- Pixel difference ratio: ${(metrics.changedRatio * 100).toFixed(4)}%\n- Stable ID preservation: ${report.stableIdDifference.preserved.length}\n`;
}
