# Aurora OS: System Code Guide

## 1. Core Architecture
Aurora Access is built on an **Asynchronous Event-Driven Microkernel** architecture. Unlike traditional monolithic kernels, our core is responsible only for orchestrating independent modules.

### The System Lifecycle
Every boot sequence follows three strict phases:
1. **Initialize**: Modules prepare their internal state (e.g., VFS loads from disk).
2. **Start**: Modules activate logic and subscribe to events.
3. **System Boot Event**: A global signal that triggers active operations (e.g., Muse starts monitoring).

## 2. Module breakdown

### [Kernel] (`core/kernel.py`)
The orchestrator. It manages the registry of modules and ensures they boot in the correct order. It uses `asyncio` to handle high-concurrency event flows.

### [Event Bus] (`core/bus.py`)
The "nervous system" of the OS. 
- **UTP Integration**: Features the **Universal Translator Protocol**, allowing the bus to decode intents from external systems (iOS, Windows, etc.) and translate them into Aurora Events.
- **Async Delivery**: Events are dispatched in parallel, ensuring no single module can hang the entire system.

### [VFS] (`core/vfs.py`)
The virtualized object storage.
- **Objects, not Files**: Data is stored as JSON-like objects with ownership metadata.
- **Automatic Encryption**: All sensitive paths (like `/users/...`) are encrypted using Fernet (AES).
- **Persistence**: Automatically syncs the virtual memory state to `vfs_storage.json`.

### [Identity] (`core/identity.py`)
The root of trust.
- **Aurora ID**: Cryptographically secure identifiers.
- **Key Management**: Manages unique encryption keys for every user.
- **Static Anchors**: Includes a permanent key for the developer ID (`Aladdin`) to ensure test data stability.

### [Muse] (`core/muse.py`)
The learning and logging module.
- **Pattern Analysis**: Monitors VFS events to build a behavioral profile.
- **Recursive Protection**: Contains logic to prevent logging loops (Muse doesn't log its own logs).
- **Private Telemetry**: User logs are encrypted with the user's own key, ensuring that even the OS admin cannot read them.

## 3. Development Principles
1. **Never Call Directly**: Modules must never import and call each other. Use `self.publish()` and `self.subscribe()`.
2. **Encrypt by Default**: Any user-related data must be written to VFS with `encrypt=True`.
3. **Async Everything**: All I/O operations must be `awaitable`.

---
*Documented by the Aurora Kernel Assistant.*
