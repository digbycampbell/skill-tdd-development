#!/usr/bin/env node

/**
 * Spec-to-Test Traceability Checker
 *
 * * Scans docs/specs/ for acceptance criteria and test files for spec references,
 * then reports which criteria have test coverage and which don't.
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

  const criteria = await extractAcceptanceCriteria();
  const { references, testFileCount } = await extractTestReferences();
  const testCount = await countTestCases();

  // Build coverage map
  const coverage = criteria.map(criterion => {
    const matchingRefs = references.filter(r => r.criterionId === criterion.id);
    return {
      ...criterion,
      covered: matchingRefs.length > 0,
      testFiles: [...new Set(matchingRefs.map(r => r.testFile))],
    };
  });

  const covered = coverage.filter(c => c.covered);
  const uncovered = coverage.filter(c => !c.covered);

  // Orphan references — test files referencing ACs that don't exist in docs/specs
  const specAcIds = new Set(criteria.map(c => c.id));
  const orphanRefs = references.filter(r => r.criterionId && !specAcIds.has(r.criterionId));

  // Print report
  console.log(`Specs found:          ${(await findFiles(specsDir, /\.md$/)).length} files`);
  console.log(`Test files found:     ${testFileCount}`);
  console.log(`Test cases found:     ~${testCount}`);
  console.log(`Acceptance criteria:  ${criteria.length}`);
  console.log(`  Covered by tests:   ${covered.length}`);
  console.log(`  NOT covered:        ${uncovered.length}`);
  console.log(`  Coverage:           ${criteria.length > 0 ? Math.round(covered.length / criteria.length * 100) : 0}%`);
  console.log();

  if (covered.length > 0) {
    console.log('COVERED:');
    for (const c of covered) {
      console.log(`  [x] ${c.id}: ${c.description}`);
      for (const tf of c.testFiles) {
        console.log(`      └── ${tf}`);
      }
    }
    console.log();
  }

  if (uncovered.length > 0) {
    console.log('NOT COVERED (need tests):');
    for (const c of uncovered) {
      console.log(`  [ ] ${c.id}: ${c.description}`);
      console.log(`      └── source: ${c.source}`);
    }
    console.log();
  }

  if (orphanRefs.length > 0) {
    console.log('ORPHAN REFERENCES (tests reference ACs not found in docs/specs):');
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
      totalCriteria: criteria.length,
      coveredCriteria: covered.length,
      uncoveredCriteria: uncovered.length,
      coveragePercent: criteria.length > 0 ? Math.round(covered.length / criteria.length * 100) : 0,
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
