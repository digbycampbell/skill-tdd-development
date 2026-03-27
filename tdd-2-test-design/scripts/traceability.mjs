#!/usr/bin/env node

/**
 * Spec-to-Test Traceability Checker
 *
 * Scans docs/specs/ for testable items and test files for spec references,
 * then reports which items have test coverage and which don't.
 *
 * Tracks:
 *   - Acceptance criteria (AC-N) from requirements.md
 *   - API endpoints (METHOD /path) from api.md
 *   - Data model entities from data-model.md
 *   - UI user flows from ui.md
 *
 * Usage:
 *   node traceability.mjs [project-root]
 *
 * Defaults to current directory if no project root is given.
 *
 * Output: a coverage report to stdout and a JSON file at
 *   docs/specs/traceability-report.json
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, relative } from 'path';

const projectRoot = process.argv[2] || process.cwd();
const specsDir = join(projectRoot, 'docs', 'specs');

// --- Helpers ---

async function findFiles(dir, pattern) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        results.push(...await findFiles(fullPath, pattern));
      } else if (entry.isFile() && pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    // Directory doesn't exist, that's fine
  }
  return results;
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

// --- Extract acceptance criteria from spec files ---

async function extractAcceptanceCriteria() {
  const criteria = [];

  if (!(await fileExists(specsDir))) {
    console.error('No docs/specs/ directory found at', specsDir);
    process.exit(1);
  }

  const specFiles = await findFiles(specsDir, /\.md$/);

  for (const file of specFiles) {
    const content = await readFile(file, 'utf-8');
    const relPath = relative(projectRoot, file);

    // Match AC-N patterns: "- [ ] AC-1: ...", "- [x] AC-1: ...", "AC-1: ..."
    const acPattern = /(?:- \[[ x]\] )?(?:AC-(\d+))[:\s]+(.+)/gi;
    let match;
    while ((match = acPattern.exec(content)) !== null) {
      criteria.push({
        id: `AC-${match[1]}`,
        description: match[2].trim(),
        source: relPath,
      });
    }

    // Also match numbered acceptance criteria without AC- prefix
    // under "## Acceptance Criteria" heading
    const acSection = content.match(/## Acceptance Criteria\n([\s\S]*?)(?=\n##|\n$|$)/);
    if (acSection) {
      const linePattern = /^(?:- \[[ x]\] )?(\d+)\.\s+(.+)/gm;
      while ((match = linePattern.exec(acSection[1])) !== null) {
        const id = `AC-${match[1]}`;
        // Don't duplicate if already found via AC-N pattern
        if (!criteria.some(c => c.id === id && c.source === relPath)) {
          criteria.push({
            id,
            description: match[2].trim(),
            source: relPath,
          });
        }
      }
    }
  }

  return criteria;
}

// --- Extract API endpoints from api.md ---

async function extractApiEndpoints() {
  const endpoints = [];
  const apiFile = join(specsDir, 'api.md');

  if (!(await fileExists(apiFile))) return endpoints;

  const content = await readFile(apiFile, 'utf-8');
  const relPath = relative(projectRoot, apiFile);

  // Match "GET /api/foo", "POST /api/bar/:id", etc. in headings or table rows
  const endpointPattern = /\b(GET|POST|PUT|PATCH|DELETE)\s+(\/\S+)/gi;
  let match;
  const seen = new Set();
  while ((match = endpointPattern.exec(content)) !== null) {
    const id = `${match[1].toUpperCase()} ${match[2]}`;
    if (!seen.has(id)) {
      seen.add(id);
      endpoints.push({
        id,
        type: 'api-endpoint',
        source: relPath,
      });
    }
  }

  return endpoints;
}

// --- Extract data model entities from data-model.md ---

async function extractDataModelEntities() {
  const entities = [];
  const dmFile = join(specsDir, 'data-model.md');

  if (!(await fileExists(dmFile))) return entities;

  const content = await readFile(dmFile, 'utf-8');
  const relPath = relative(projectRoot, dmFile);

  // Match "### EntityName" or "## EntityName" under an Entities section
  const entitySection = content.match(/## Entities\n([\s\S]*?)(?=\n## [^#]|$)/);
  if (entitySection) {
    const headingPattern = /^###\s+`?(\w+)`?/gm;
    let match;
    while ((match = headingPattern.exec(entitySection[1])) !== null) {
      entities.push({
        id: `Entity:${match[1]}`,
        type: 'data-entity',
        source: relPath,
      });
    }
  }

  // Match state transitions: "draft → published", "active → archived", etc.
  const transitionPattern = /(\w+)\s*→\s*(\w+)/g;
  let tmatch;
  const transitions = new Set();
  while ((tmatch = transitionPattern.exec(content)) !== null) {
    const id = `Transition:${tmatch[1]}→${tmatch[2]}`;
    if (!transitions.has(id)) {
      transitions.add(id);
      entities.push({
        id,
        type: 'state-transition',
        source: relPath,
      });
    }
  }

  return entities;
}

// --- Extract UI user flows from ui.md ---

async function extractUiFlows() {
  const flows = [];
  const uiFile = join(specsDir, 'ui.md');

  if (!(await fileExists(uiFile))) return flows;

  const content = await readFile(uiFile, 'utf-8');
  const relPath = relative(projectRoot, uiFile);

  // Match "### Flow Name" or numbered flows under "## User Flows"
  const flowSection = content.match(/## User Flows\n([\s\S]*?)(?=\n## [^#]|$)/);
  if (flowSection) {
    const headingPattern = /^###\s+(.+)/gm;
    let match;
    while ((match = headingPattern.exec(flowSection[1])) !== null) {
      flows.push({
        id: `Flow:${match[1].trim()}`,
        type: 'ui-flow',
        source: relPath,
      });
    }

    // Also match numbered list items as flows if no sub-headings found
    if (flows.length === 0) {
      const listPattern = /^\d+\.\s+(.+)/gm;
      while ((match = listPattern.exec(flowSection[1])) !== null) {
        flows.push({
          id: `Flow:${match[1].trim()}`,
          type: 'ui-flow',
          source: relPath,
        });
      }
    }
  }

  return flows;
}

// --- Extract spec references from test files ---

async function extractTestReferences() {
  const references = [];
  const testPatterns = /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/;

  // Search common test locations
  const searchDirs = [
    join(projectRoot, 'tests'),
    join(projectRoot, '__tests__'),
    join(projectRoot, 'src'),
    join(projectRoot, 'test'),
  ];

  const testFiles = [];
  for (const dir of searchDirs) {
    testFiles.push(...await findFiles(dir, testPatterns));
  }

  for (const file of testFiles) {
    const content = await readFile(file, 'utf-8');
    const relPath = relative(projectRoot, file);

    // Match "Spec: docs/specs/requirements.md — AC-1, AC-2, AC-3"
    const specRefPattern = /Spec:\s*([^\n—-]+?)(?:\s*[—-]\s*(.+))?$/gm;
    let match;
    while ((match = specRefPattern.exec(content)) !== null) {
      const specFile = match[1].trim();
      const criteriaStr = match[2] || '';

      // Extract individual AC references
      const acRefs = criteriaStr.match(/AC-\d+/g) || [];
      for (const ac of acRefs) {
        references.push({
          criterionId: ac,
          testFile: relPath,
          specFile,
        });
      }

      // If no specific AC refs, just note the spec file link
      if (acRefs.length === 0) {
        references.push({
          criterionId: null,
          testFile: relPath,
          specFile,
        });
      }
    }

    // Also match inline AC-N references in test names or comments
    const inlineAcPattern = /AC-(\d+)/g;
    const inlineMatches = new Set();
    while ((match = inlineAcPattern.exec(content)) !== null) {
      inlineMatches.add(`AC-${match[1]}`);
    }
    for (const ac of inlineMatches) {
      if (!references.some(r => r.criterionId === ac && r.testFile === relPath)) {
        references.push({
          criterionId: ac,
          testFile: relPath,
          specFile: '(inline reference)',
        });
      }
    }

    // Match API endpoint references: "GET /api/foo", "POST /path" in test files
    const endpointRefPattern = /\b(GET|POST|PUT|PATCH|DELETE)\s+(\/\S+)/gi;
    while ((match = endpointRefPattern.exec(content)) !== null) {
      const id = `${match[1].toUpperCase()} ${match[2]}`;
      if (!references.some(r => r.criterionId === id && r.testFile === relPath)) {
        references.push({
          criterionId: id,
          testFile: relPath,
          specFile: '(inline endpoint reference)',
        });
      }
    }

    // Match entity references: "Entity:Name" in test comments
    const entityRefPattern = /Entity:(\w+)/g;
    while ((match = entityRefPattern.exec(content)) !== null) {
      const id = `Entity:${match[1]}`;
      if (!references.some(r => r.criterionId === id && r.testFile === relPath)) {
        references.push({
          criterionId: id,
          testFile: relPath,
          specFile: '(inline entity reference)',
        });
      }
    }

    // Match flow references: "Flow:Name" in test comments
    const flowRefPattern = /Flow:(.+?)(?:\s*\*\/|\s*$)/gm;
    while ((match = flowRefPattern.exec(content)) !== null) {
      const id = `Flow:${match[1].trim()}`;
      if (!references.some(r => r.criterionId === id && r.testFile === relPath)) {
        references.push({
          criterionId: id,
          testFile: relPath,
          specFile: '(inline flow reference)',
        });
      }
    }
  }

  return { references, testFileCount: new Set(testFiles.map(f => relative(projectRoot, f))).size };
}

// --- Count test cases ---

async function countTestCases() {
  const testPatterns = /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/;
  const searchDirs = [
    join(projectRoot, 'tests'),
    join(projectRoot, '__tests__'),
    join(projectRoot, 'src'),
    join(projectRoot, 'test'),
  ];

  let totalTests = 0;
  for (const dir of searchDirs) {
    const files = await findFiles(dir, testPatterns);
    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      // Count it() and test() calls (rough but useful)
      const matches = content.match(/(?:^|\s)(?:it|test)\s*\(/gm);
      totalTests += matches ? matches.length : 0;
    }
  }
  return totalTests;
}

// --- Main ---

async function main() {
  console.log(`\nTraceability Report for: ${projectRoot}\n${'='.repeat(50)}\n`);

  // Gather all trackable spec items
  const criteria = await extractAcceptanceCriteria();
  const apiEndpoints = await extractApiEndpoints();
  const dataEntities = await extractDataModelEntities();
  const uiFlows = await extractUiFlows();

  const allSpecItems = [
    ...criteria,
    ...apiEndpoints,
    ...dataEntities,
    ...uiFlows,
  ];

  const { references, testFileCount } = await extractTestReferences();
  const testCount = await countTestCases();

  // Build coverage map
  const coverage = allSpecItems.map(item => {
    const matchingRefs = references.filter(r => r.criterionId === item.id);
    return {
      ...item,
      covered: matchingRefs.length > 0,
      testFiles: [...new Set(matchingRefs.map(r => r.testFile))],
    };
  });

  const covered = coverage.filter(c => c.covered);
  const uncovered = coverage.filter(c => !c.covered);

  // Orphan references — tests referencing items that don't exist in docs/specs
  const specItemIds = new Set(allSpecItems.map(c => c.id));
  const orphanRefs = references.filter(r => r.criterionId && !specItemIds.has(r.criterionId));

  // Group by type for display
  const acItems = coverage.filter(c => c.id.startsWith('AC-'));
  const endpointItems = coverage.filter(c => c.type === 'api-endpoint');
  const entityItems = coverage.filter(c => c.type === 'data-entity');
  const transitionItems = coverage.filter(c => c.type === 'state-transition');
  const flowItems = coverage.filter(c => c.type === 'ui-flow');

  // Print summary
  console.log(`Specs found:          ${(await findFiles(specsDir, /\.md$/)).length} files`);
  console.log(`Test files found:     ${testFileCount}`);
  console.log(`Test cases found:     ~${testCount}`);
  console.log();
  console.log(`Trackable spec items: ${allSpecItems.length}`);
  console.log(`  Acceptance criteria:  ${acItems.length} (${acItems.filter(c => c.covered).length} covered)`);
  if (endpointItems.length > 0)
    console.log(`  API endpoints:        ${endpointItems.length} (${endpointItems.filter(c => c.covered).length} covered)`);
  if (entityItems.length > 0)
    console.log(`  Data entities:        ${entityItems.length} (${entityItems.filter(c => c.covered).length} covered)`);
  if (transitionItems.length > 0)
    console.log(`  State transitions:    ${transitionItems.length} (${transitionItems.filter(c => c.covered).length} covered)`);
  if (flowItems.length > 0)
    console.log(`  UI flows:             ${flowItems.length} (${flowItems.filter(c => c.covered).length} covered)`);
  console.log(`  Overall coverage:     ${allSpecItems.length > 0 ? Math.round(covered.length / allSpecItems.length * 100) : 0}%`);
  console.log();

  // Print detailed results by type
  function printSection(label, items) {
    if (items.length === 0) return;
    const coveredItems = items.filter(c => c.covered);
    const uncoveredItems = items.filter(c => !c.covered);

    console.log(`${label}:`);
    for (const c of coveredItems) {
      console.log(`  [x] ${c.id}${c.description ? ': ' + c.description : ''}`);
      for (const tf of c.testFiles) {
        console.log(`      └── ${tf}`);
      }
    }
    for (const c of uncoveredItems) {
      console.log(`  [ ] ${c.id}${c.description ? ': ' + c.description : ''}`);
      console.log(`      └── source: ${c.source}`);
    }
    console.log();
  }

  printSection('ACCEPTANCE CRITERIA', acItems);
  printSection('API ENDPOINTS', endpointItems);
  printSection('DATA ENTITIES', entityItems);
  printSection('STATE TRANSITIONS', transitionItems);
  printSection('UI FLOWS', flowItems);

  if (orphanRefs.length > 0) {
    console.log('ORPHAN REFERENCES (tests reference items not found in docs/specs):');
    for (const r of orphanRefs) {
      console.log(`  ? ${r.criterionId} referenced in ${r.testFile}`);
    }
    console.log();
  }

  // Save JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      specFiles: (await findFiles(specsDir, /\.md$/)).length,
      testFiles: testFileCount,
      testCases: testCount,
      totalItems: allSpecItems.length,
      coveredItems: covered.length,
      uncoveredItems: uncovered.length,
      coveragePercent: allSpecItems.length > 0 ? Math.round(covered.length / allSpecItems.length * 100) : 0,
      byType: {
        acceptanceCriteria: { total: acItems.length, covered: acItems.filter(c => c.covered).length },
        apiEndpoints: { total: endpointItems.length, covered: endpointItems.filter(c => c.covered).length },
        dataEntities: { total: entityItems.length, covered: entityItems.filter(c => c.covered).length },
        stateTransitions: { total: transitionItems.length, covered: transitionItems.filter(c => c.covered).length },
        uiFlows: { total: flowItems.length, covered: flowItems.filter(c => c.covered).length },
      },
    },
    covered,
    uncovered,
    orphanReferences: orphanRefs,
  };

  const reportPath = join(specsDir, 'traceability-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report saved to: ${relative(projectRoot, reportPath)}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
