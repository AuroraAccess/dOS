# The Evolution of Aurora's Language

## 1. Current State: Prototyping Phase (v0.1 Alpha)
**Language: Python (FastAPI / Asyncio)**
- **Role**: High-level logic orchestration.
- **Goal**: Rapidly iterate on UTP (Universal Translator Protocol) and VFS logic.
- **Constraint**: Relies on the Python Runtime and an underlying OS (Linux/macOS/Windows).

## 2. The Native Vision: The "Clean Slate" Core
To achieve true independence from existing operating systems, the production Kernel must transition to a language that can talk to hardware without a middleman.

### Target Language: **Rust**
- **Memory Safety**: Eliminates the largest class of kernel bugs (buffer overflows, null pointers) without needing a Garbage Collector.
- **Bare Metal Performance**: Can be compiled to run directly on the processor (Ring 0), becoming the "master" of the hardware.
- **Concurrency**: Rust's ownership model is perfect for Aurora's asynchronous Event Bus.

## 3. The Secret Weapon: A-Code (Aurora Native Bytecode)
Beyond the core, Aurora will use its own execution format: **A-Code**.

- **Hardware Agnostic**: Modules written in A-Code will run identically on an ARM chip (iPhone) or an x86 chip (Laptop).
- **Soldered Security**: A-Code will have built-in verification logic. The Kernel won't just run code; it will "validate the soldering" before execution.
- **Real-time Translation**: UTP will not just translate protocols, but also JIT-compile (Just-In-Time) external intents into A-Code instructions.

## 4. Roadmap
1. **v0.1 - v0.5**: Finalize all logic in **Python**. Focus on "The What" (features, UTP, VFS).
2. **v0.6 - v0.9**: Rewrite core components in **Rust**. Focus on "The How" (performance, bare-metal).
3. **v1.0**: The first **Pure Aurora Boot**. Zero dependencies on Linux/NT kernels. Full **A-Code** support.

---
*Language is the first layer of freedom.*
