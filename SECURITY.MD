# Security Policy: ARM64-core & dOS

<!-- NOTICE: This file is protected under RCF-PL v1.3 -->
<!-- [RCF:PUBLIC] -->

This document outlines the security procedures and vulnerability reporting process for the **ARM64-core** ecosystem, including the **dOS** submodule and **Sentinel** PQC modules.

## Supported Versions

We actively provide security updates for the following versions:

| Version | Status | Notes |
| :--- | :--- | :--- |
| **v1.3.x** | ✅ Supported | Current "Integrity Release" (RCF Compliance) |
| v1.2.x | ⚠️ Legacy | Maintenance only, upgrade recommended |
| < v1.2.0 | ❌ End of Life | No longer supported |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

To report a vulnerability, please follow these steps:
1.  **Preparation**: Create a detailed report including steps to reproduce, potential impact, and affected components (Kernel, VM, VFS, etc.).
2.  **Submission**: Send the report to the maintainer via the official secure channel. 
    - **Primary Channel**: Secure email/message as defined in the **Aurora Access Portal**.
    - **Encryption**: If possible, sign/encrypt your report using the system's PQC (Post-Quantum Cryptography) logic or standard PGP.

## Our Response Process

1.  **Acknowledgment**: You will receive an acknowledgment of your report within 48 hours.
2.  **Validation**: Our core team will validate the vulnerability within 5 business days.
3.  **Remediation**: If valid, we will prepare a patch. Critical vulnerabilities take priority and are typically resolved within 72 hours.
4.  **Disclosure**: Disclosure timing will be coordinated with the reporter to ensure users have time to update their systems.

## RCF Compliance Verification

All security patches are subject to a mandatory **RCF-Audit**. Before deployment, the `rcf-cli audit` must verify 100% integrity of the new code blocks. We do not accept patches that violate the "Soldered Logic" (zero external dependency) principle.

---
*Ensuring the sovereignty of the digital heart. System Status: PROTECTED.*
