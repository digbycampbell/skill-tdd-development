# [Project Name]

[One-line description of what this project does.]

## Documentation

| | |
|---|---|
| **[Specifications](docs/specs/)** | Requirements, architecture, data model, API contracts |
| **[Roadmap](docs/ROADMAP.md)** | Priorities, current cycle, sequencing |
| **[All docs](docs/)** | Documentation index |

## Getting Started

<!-- Quick setup instructions for running the project locally. -->

```bash
# clone
git clone --recurse-submodules https://github.com/[owner]/[repo].git
cd [repo]

# install
npm install

# run
npm run dev
```

## Development

This project uses a TDD development pipeline. See the [roadmap](docs/ROADMAP.md)
for current priorities and [docs/specs/](docs/specs/) for detailed specifications.

The pipeline skills are included as a git submodule at `.claude/skills/`.
To update them: `git submodule update --remote .claude/skills`
