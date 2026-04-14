# Contributing to Aurora Access

Aurora is a small, precise project. Contributions are welcome — but the bar is high by design. One line of soldered logic is worth more than a hundred lines of abstraction.

---

## Before You Start

Read these first:

- [ARCHITECTURE.md](ARCHITECTURE.md) — understand the C-Core and A-VM before touching kernel code
- [SOLDERED_LOGIC.md](SOLDERED_LOGIC.md) — the principle that governs how all C-Core code is written
- [ROADMAP.md](ROADMAP.md) — contributions must align with an active or planned phase

If your idea doesn't fit an existing phase, open an issue first. Don't build in a vacuum.

---

## Philosophy

Three rules that govern every line in this codebase:

**Purity** — Zero external dependencies in the C-Core. If it requires a library, it doesn't belong in the kernel.

**Determinism** — Given the same input, the system must produce the same output. Always. No exceptions for "edge cases."

**Intent** — Every function must have a documented purpose. Code without declared intent is not accepted.

---

## Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/dOS
cd dOS

# Verify ARM toolchain
arm-none-eabi-gcc --version

# Build and run C-Core
cd ARM64-core && make clean && make && ./aurora_core

# Python environment (Bridge/Gateway)
python3 --version  # requires 3.10+
pip install -r requirements.txt
```

---

## Coding Standards

### C-Core (Kernel)

Language: **ANSI C (C89/C90)**. No exceptions. This is a bare-metal target.

```c
/**
 * Intent: Transduce raw BPM telemetry into a normalized system mood vector.
 * Reflexive Impact: Modifies pulse_state; may trigger Sovereign Pulse Bus event.
 */
void pi_transduce_bpm(uint16_t raw_bpm, pulse_state_t *state) {
    /* implementation */
}
```

Rules:
- **No `malloc`** — static or stack allocation only. Heap is non-deterministic on bare-metal
- **No external headers** outside of `aurora_config.h` and the C-Core include tree
- `snake_case` for functions and variables, `UPPER_SNAKE_CASE` for constants
- Every function needs the Intent/Reflexive Impact comment block shown above
- Max function length: 40 lines. If it's longer, it's doing too much

### Python (Bridge / Gateway)

Standard: PEP 8. Enforced via `ruff` (included in dev requirements).

```python
async def transduce_pulse(bpm: int, threshold: float) -> PulseEvent:
    """
    Map raw BPM data to a PulseEvent for the Sovereign Pulse Bus.
    
    Args:
        bpm: Raw heart rate from biometric sensor
        threshold: Stress trigger threshold (0.0–1.0)
    
    Returns:
        PulseEvent with normalized mood vector
    """
```

Rules:
- Type hints required on all public functions
- `asyncio` for all I/O-bound operations — no blocking calls in gateway code
- Docstrings required on all public methods

---

## Security & PQC Compliance

Any change to the Sentinel PQC layer requires all three of the following:

1. **Dilithium2 compatibility** — do not break the existing signature scheme
2. **RCF signature** — your change must be signed with an RCF-compliant key
3. **Audit pass** — run `rcf-cli audit` and include the output in your PR

```bash
rcf-cli audit --component sentinel --output audit.log
```

PRs touching the security layer without a passing audit log will be closed without review.

---

## Commit Format

```
[COMPONENT] (Intent): Description
```

Components: `C-CORE`, `SENTINEL`, `BRIDGE`, `FRONTEND`, `RCF`, `DOCS`

Intent types:
- `Reflex` — new behavior or response logic
- `Harden` — security improvement
- `Purge` — dependency removal or dead code cleanup
- `Fix` — bug correction
- `Spec` — documentation or specification update

Examples:

```
[C-CORE] (Reflex): Add BPM spike handler to Sovereign Pulse Bus
[SENTINEL] (Harden): Enforce RCF signature check on boot sequence
[BRIDGE] (Purge): Remove requests dependency, use stdlib urllib
[DOCS] (Spec): Document A-Code opcode table for Phase 18
```

---

## Pull Request Process

1. **Link to a Phase** — reference the ROADMAP phase your PR addresses in the description
2. **Update LOGBOOK.md** — one entry per PR, format: `YYYY-MM-DD | [COMPONENT] | Summary`
3. **Run sanity checks** — all of the following must pass:

```bash
cd ARM64-core && make clean && make          # kernel build
./aurora_core --self-test                    # runtime checks
rcf-cli audit                                 # if touching Sentinel
ruff check bridge_gateway.py                  # if touching Python
```

4. **Request review** — tag a Core Maintainer. Expected review time: 3–7 days

PRs that skip LOGBOOK.md, fail sanity checks, or have no Phase link will not be reviewed until corrected.

---

## What We Don't Accept

To keep the codebase clean, the following will be declined:

- Any C code that calls `malloc`, `free`, or any heap allocator
- External libraries added to the C-Core build
- Changes to the PQC layer without a passing `rcf-cli audit`
- "Drive-by" refactors with no linked issue or Phase reference
- Cosmetic-only changes to documentation without substance

---

## License

By submitting a contribution, you agree that your code will be licensed under **RCF-PL v1.2.3** and must adhere to the principles of Pure Intelligence. See [LICENSE](LICENSE) for full terms, including the anti-extraction provision.
