/* NOTICE: This file is protected under RCF-PL v1.3
 * [RCF:PUBLIC]
 *
 * AURORA CORE CONFIGURATION
 * Part of the Aurora Access dOS Ecosystem
 * Strategy: Modular Matrix (Phase 18)
 */

#ifndef AURORA_CONFIG_H
#define AURORA_CONFIG_H

/* [HARDWARE TARGET] */
#define TARGET_ARM64    1
#define TARGET_CORTEX_M 0

/* [MODULE TOGGLES] */
#define CONFIG_SENTINEL_PQC    1   /* Enable/Disable PQC Sentinel (Disable for PerformanceCortex) */
#define CONFIG_SENTIENCE       1   /* Enable/Disable Sentience Logic (Sentient Engine) */
#define CONFIG_VFS             1   /* Enable Sovereign VFS */
#define CONFIG_LUME_VOICE      1   /* Enable Inner Voice Engine */

/* [SYSTEM PARAMETERS] */
#define CORE_VERSION "1.5.0-JISA-UNIFIED"

#endif /* AURORA_CONFIG_H */
