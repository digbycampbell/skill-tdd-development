# TDD Development Pipeline — Agent Skills

A set of 5 [Agent Skills](https://agentskills.io) that guide AI coding agents through a structured Test-Driven Development workflow.

## The Pipeline

| Phase | Skill | What it does |
|-------|-------|-------------|
| 1 | `tdd-1-requirements` | Interview, capture requirements, produce spec documents in `docs/specs/` |
| 2 | `tdd-2-test-design` | Write failing tests derived from the specs (the "Red" phase) |
| 3 | `tdd-3-implement` | Write minimum code to make tests pass (the "Green" phase) |
| 4 | `tdd-4-refactor` | Clean up code while keeping tests green |
| 5 | `tdd-5-evaluate` | Assess coverage, spec drift, and decide what to cycle on next |

Each phase produces artifacts that feed the next. Specs live in `docs/specs/` as markdown files committed to your repo. Tests trace back to acceptance criteria via `AC-N` references. The evaluate phase closes the loop by telling you which phase to re-enter.

## Quick Start — Add to Your Project

### Using git submodule (recommended)

This keeps the skills in sync across all your projects. When you improve a skill here, every project can pull the update.

```bash
# From your project root
git submodule add https://github.com/digbycampbell/skill-tdd-development.git .claude/skills
git commit -m "Add TDD development pipeline skills"
```

That's it. The 5 skills are now available in Claude Code via `/tdd-1-requirements`, `/tdd-2-test-design`, etc.

### Cloning a project that already has the submodule

```bash
# Option A: clone with submodules in one step
git clone --recurse-submodules https://github.com/your-username/your-project.git

# Option B: if you already cloned without --recurse-submodules
cd your-project
git submodule init
git submodule update
```

### Updating to the latest skills

When skills have been improved in this repo:

```bash
cd your-project
git submodule update --remote .claude/skills
git add .claude/skills
git commit -m "Update TDD skills to latest"
```

## Usage

Once installed, invoke each phase in Claude Code:

```
/tdd-1-requirements    # Start here — spec out what you're building
/tdd-2-test-design     # Write tests based on the specs
/tdd-3-implement       # Make the tests pass
/tdd-4-refactor        # Clean up with tests as safety net
/tdd-5-evaluate        # Assess and decide what's next
```

### For an existing messy project

You don't have to spec the entire app at once. Pick the messiest or most critical area, run one full cycle (phases 1–5) on just that piece, then pick the next piece.

### For a new project

Start with `/tdd-1-requirements`. The skill will interview you, create the `docs/specs/` directory with structured spec documents, and generate README files that make the documentation discoverable on GitHub.

## What's in Each Skill

```
tdd-1-requirements/
├── SKILL.md              ← Requirements capture instructions
└── assets/               ← Spec document templates + README templates
    ├── requirements.md
    ├── architecture.md
    ├── data-model.md
    ├── api.md
    ├── auth.md
    ├── ui.md
    ├── integration.md
    ├── docs-readme.md
    └── specs-readme.md

tdd-2-test-design/
├── SKILL.md              ← Test design instructions
├── references/
│   └── test-frameworks.md  ← Vitest/Jest/Playwright setup & patterns
└── scripts/
    └── traceability.mjs    ← Spec-to-test coverage checker

tdd-3-implement/
└── SKILL.md              ← Implementation instructions (Green phase)

tdd-4-refactor/
└── SKILL.md              ← Refactoring instructions (Clean phase)

tdd-5-evaluate/
├── SKILL.md              ← Evaluation instructions
└── assets/
    └── evaluation-report.md  ← Structured report template
```

## Compatibility

These skills follow the [agentskills.io](https://agentskills.io) open standard and work with any compatible agent, including Claude Code, OpenAI Codex, GitHub Copilot, and others.

**This pipeline is designed for JavaScript/TypeScript web applications.** The test framework references, tooling (Vitest, Jest, Playwright, React Testing Library), and traceability script all assume a JS/TS project with Node.js available. The TDD process and spec document structures are language-agnostic in principle, but the bundled tooling and guidance are JS/TS-specific. Support for other ecosystems (Python, Go, Rust, etc.) may be added in future versions.

## License

MIT
