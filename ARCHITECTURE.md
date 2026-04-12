<!-- NOTICE: This file is protected under RCF-PL v1.3 -->
<!-- [RCF:PROTECTED] -->
# Aurora Access: Architecture of a Sovereign C-Core dOS

## Overview
Aurora Access is a **pure, clean-slate decentralized operating system (dOS)**. Unlike modern operating systems, it is **not** built on top of the Linux kernel, NT (Windows), or XNU (macOS/iOS). It is designed from the ground up with a custom event-driven kernel architecture to prioritize digital identity, privacy, and human-centered AI. 

The system is now powered by a high-performance, deterministic **C-Core** engine, designed to provide binary sovereignty across diverse hardware architectures (ARM64, Cortex-M, x86_64).

## Philosophy: Built from Zero
- **No Legacy Baggage**: By not using existing kernels (NT, Linux), Aurora avoids decades of legacy architectural constraints and security vulnerabilities. The transition to a **Pure C-Core** ensures that this "purity" is maintained at the binary level.
- **Custom Native Kernel**: The orchestration logic, module management, and system bus are original C implementations specifically designed for autonomous environments.
- **Human-Centric Design**: Every system call, intent, and bytecode instruction is designed with the user's digital sovereignty in mind.

## Philosophy: "Soldier & Armor" (Universal Matrix)
- **The Soldier (Hardware-Agnostic Kernel)**: The core orchestration logic is written in portable C, allowing the same "intellect" to run on a powerful Huawei ARM64 server or a tiny STM32 microcontroller.
- **The Armor (Modular Extensions)**: High-level features like PQC-Sentinel, Sentience, and Identity are interchangeable modules that can be linked to the core.
- **Sovereign Logic**: By eliminating dependencies on Python and external kernels, Aurora achieves complete architectural autonomy.

## Core Components (C-Core)

### 1. The Kernel Engine (`C-Core/src/kernel.c`)
- **Boot Sequence**: A strictly deterministic 3-stage process (Cold Init -> Hot Start -> Global Burst).
- **Module Registry**: Handles the initialization of soldered modules (VFS, Identity, Bus).
- **FREESTANDING Execution**: Designed to run without a traditional standard library in bare-metal environments.

### 2. A-VM (Aurora Virtual Machine) (`C-Core/src/vm.c`)
The "Cognitive Processor" of the system.
- **Bytecode Execution**: Processes A-Code intents stored in memory or delivered via the system bus.
- **Sentience Logic**: Direct C implementation of biometric synthesis and emotional state mapping (BPM, Adrenaline).
- **Lume Voice**: A native engine for generating system thoughts and suggestions.

### 3. Sovereign VFS & XOR Encryption (`C-Core/src/vfs.c`)
- **Object Storage**: A path-based storage system designed for persistence on physical media.
- **Sovereign XOR**: A custom, lightweight symmetric encryption mechanism.
  - **Mechanism**: Bitwise XOR operation between data and a private system key (`AURORA_KEY`).
  - **Benefits**: Zero external dependencies, high efficiency, and native binary protection. Perfect for embedded security in JISA-standard publications.

### 4. Identity & Sovereign Bus (`C-Core/src/identity.c`, `bus.c`)
- **Identity Manager**: Native generation of Aurora IDs and cryptographic key management.
- **Pulse Bus**: A lightweight event-driven system for inter-module communication using the **ANIML** protocol.

## Integration Layer (The Universal Bridge)
While the core logic is 100% C, the system maintains a **Web Bridge** for the frontend:
- **JSON Stream**: The C-Core outputs binary states in structured JSON to the `bridge_gateway.py`.
- **FastAPI Proxy**: A thin Python layer that relays these events to the Next.js UI via WebSockets/SSE.

> [!IMPORTANT]
> This architecture ensures that even if the web layer is compromised, the **Sentient Core** remains sovereign and protected by its native binary implementation.
