# TDD Development Pipeline — Agent Skills

A set of 6 [Agent Skills](https://agentskills.io) that guide AI coding agents through a structured Test-Driven Development workflow.

## The Pipeline

| Phase | Skill | What it does |
|-------|-------|-------------|
| 0 | `tdd-0-init` | Set up project docs structure, create initial specs and roadmap (run once) |
| 1 | `tdd-1-requirements` | Interview, capture per-cycle requirements, update canonical specs |
| 2 | `tdd-2-test-design` | Write failing tests derived from the specs (the "Red" phase) |
| 3 | `tdd-3-implement` | Write minimum code to make tests pass (the "Green" phase) |
| 4 | `tdd-4-refactor` | Clean up code while keeping tests green |
| 5 | `tdd-5-evaluate` | Assess coverage, spec drift, and decide what to cycle on next |

**Phase 0** runs once per project to create the `docs/` directory, canonical `requirements.md`, concern documents (architecture, data model, API, UI, etc.), roadmap, and READMEs. **Phase 1** then runs at the start of each TDD cycle to add new acceptance criteria for the current feature.

Each phase produces artifacts that feed the next. Specs live in `docs/` as markdown files committed to your repo. Tests trace back to acceptance criteria via `AC-N` references. The evaluate phase closes the loop by telling you which phase to re-enter.

## Quick Start — Add to Your Project

### Full setup (copy-paste checklist)

Run these steps from your project root to add the skills **and** ensure they survive Claude Code web sessions:

```bash
# 1. Add the submodule
git submodule add https://github.com/digbycampbell/skill-tdd-development.git .claude/skills

# 2. Create the SessionStart hook so submodules auto-init in web sessions
mkdir -p .claude
cat > .claude/settings.json << 'EOF'
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "git submodule update --init --recursive"
          }
        ]
      }
    ]
  }
}
EOF

# 3. Commit both
git add .gitmodules .claude/skills .claude/settings.json
git commit -m "Add TDD development pipeline skills with SessionStart hook"
```

> **Why the hook?** Claude Code on the web clones repos without `--recurse-submodules`, so the `.claude/skills` directory will be empty at the start of every session. The SessionStart hook runs `git submodule update --init --recursive` automatically before you start working.

### Using git submodule only

If you don't use Claude Code on the web, or you prefer to manage submodule init yourself:

```bash
# From your project root
git submodule add https://github.com/digbycampbell/skill-tdd-development.git .claude/skills
git commit -m "Add TDD development pipeline skills"
```

The 6 skills are now available in Claude Code via `/tdd-0-init`, `/tdd-1-requirements`, `/tdd-2-test-design`, etc.

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
/tdd-0-init            # Run once — set up docs structure and initial specs
/tdd-1-requirements    # Each cycle — spec out what you're building
/tdd-2-test-design     # Write tests based on the specs
/tdd-3-implement       # Make the tests pass
/tdd-4-refactor        # Clean up with tests as safety net
/tdd-5-evaluate        # Assess and decide what's next
```

### For an existing messy project

Run `/tdd-0-init` first to set up the docs structure. Then pick the messiest or most critical area, run one full cycle (phases 1-5) on just that piece, then pick the next piece.

### For a new project

Start with `/tdd-0-init`. The skill will interview you, create the `docs/` directory with structured spec documents, and generate README files that make the documentation discoverable on GitHub. Then run `/tdd-1-requirements` to add cycle-specific acceptance criteria.

## What's in Each Skill

```
tdd-0-init/
├── SKILL.md              ← Project initialisation instructions
└── assets/               ← Spec document templates + README templates
    ├── requirements.md
    ├── architecture.md
    ├── data-model.md
    ├── api.md
    ├── auth.md
    ├── ui.md
    ├── integration.md
    ├── infrastructure.md
    ├── docs-readme.md
    ├── roadmap.md
    └── root-readme.md

tdd-1-requirements/
└── SKILL.md              ← Per-cycle requirements capture instructions

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

## Roadmap

Planned improvements to the skills pipeline:

- [ ] **CI/CD integration guide** — GitHub Actions workflow template for running the traceability checker on PRs, PR template referencing TDD phases, and evaluation report as a merge gate
- [ ] **Multi-language support** — Test framework references and traceability tooling for Python (pytest), Go (testing), Rust (cargo test), and other ecosystems

## License

MIT
