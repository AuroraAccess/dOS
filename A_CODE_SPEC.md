<!-- NOTICE: This file is protected under RCF-PL v1.2.3 -->
<!-- [RCF:PUBLIC] -->
# A-Code: Aurora Native Bytecode Specification

## 1. Vision
**A-Code** is the native execution language of Aurora Access. It is designed to be the ultimate "soldered" language—providing total abstraction from physical hardware while maintaining near-metal performance. 

In Aurora, modules are not just programs; they are sets of A-Code instructions that the Kernel validates and executes in a protected environment.

## 2. Design Principles
- **Hardware Agnostic**: A-Code runs identically on any architecture (ARM, x86, RISC-V) via the Aurora Virtual Machine (A-VM).
- **Atomic Verifiability**: Before execution, the Kernel checks the "soldering integrity" of the A-Code block.
- **Intent-Based**: Unlike traditional bytecode (Java/Python), A-Code instructions are focused on *System Intents* (e.g., `SECURE_WRITE`, `BUS_EMIT`, `UTP_TRANSLATE`).

## 3. Instruction Set (v0.1 Prototype)

| Opcode | Name | Description |
| :--- | :--- | :--- |
| `0x01` | `INIT_MOD` | Initializes a new module context. |
| `0x05` | `IDENTITY_GEN`| Generates a new Aurora ID and releases a secure key. |
| `0x10` | `VFS_STORE` | Atomically stores an object in VFS. |
| `0x11` | `VFS_FETCH` | Retrieves an object with automatic key resolution. |
| `0x20` | `BUS_PUB` | Publishes an event to the System Bus. |
| `0x21` | `BUS_SUB` | Subscribes to a specific intent. |
| `0x30` | `UTP_TRANS` | Invokes the Universal Translator for a specific payload. |
| `0x99` | `HALT` | Gracefully terminates the execution block. |

## 4. Execution Model: The A-VM
The **Aurora Virtual Machine (A-VM)** is a "soldered" component of the core. It doesn't interpret code line-by-line in a slow loop; it maps A-Code instructions directly to native Kernel functions.

### The "Soldering" Check:
1. **Signature Verification**: Every A-Code block must have a valid module signature.
2. **Bounds Checking**: A-Code cannot access memory outside its allocated object space in VFS.
3. **Intent Validation**: If a module tries to use `UTP_TRANS` without permission, the A-VM halts immediately.

## 5. Why A-Code is the "Correct Way"
By using our own bytecode, we achieve:
1. **Immunity to External Exploits**: Vulnerabilities in Python, Java, or C++ runtimes do not affect A-Code.
2. **Future-Proofing**: We can migrate the underlying Kernel from Python to Rust (or anything else), and the A-Code modules will continue to work without a single change.
3. **True Autonomy**: Aurora doesn't "run apps"; it "executes native digital intents."

---
*A-Code: The language of the clean-slate future.*
