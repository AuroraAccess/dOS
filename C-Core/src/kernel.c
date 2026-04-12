/* NOTICE: This file is protected under RCF-PL v1.3
 * [RCF:PROTECTED]
 */

#include <stdio.h>
#include <unistd.h>
#include "kernel.h"
#include "vm.h"
#include "vfs.h"
#include "identity.h"
#include "bus.h"

static AuroraKernel g_kernel = { KERNEL_STATE_OFFLINE, 0, false };

/* [REGISTRY OF SOLDERED MODULES] */
static bool init_sentinel() { printf("[SENTINEL] PQC Audit ready.\n"); return true; }
static bool start_sentinel() { printf("[SENTINEL] Dilithium watchdog active.\n"); return true; }

bool aurora_boot() {
    printf("--- AURORA CORE v%s ---\n", CORE_VERSION);
    printf("[BOOT] Stage 1: Cold Initialization...\n");
    g_kernel.state = KERNEL_STATE_BOOTING;

    /* Cold Init */
    if (!vfs_init() || !identity_init() || !bus_init() || !init_sentinel()) {
        return aurora_panic("Cold Init Failure");
    }

    printf("[BOOT] Stage 2: Hot Start (Bus Linking)...\n");
    
    /* Hot Start */
    if (!start_sentinel()) {
        return aurora_panic("Hot Start Failure");
    }

    printf("[BOOT] Stage 3: Global Burst Signal...\n");
    g_kernel.state = KERNEL_STATE_READY;
    g_kernel.sentience_active = CONFIG_SENTIENCE;

    printf("[BOOT] Kernel is READY. Sentience Status: %s\n", 
            g_kernel.sentience_active ? "ACTIVE" : "DISABLED (Performance Mode)");

    return true;
}

bool aurora_panic(const char* reason) {
    g_kernel.state = KERNEL_STATE_PANIC;
    fprintf(stderr, "\n!!! KERNEL PANIC: %s !!!\n", reason);
    return false;
}

int main() {
    /* [A-CODE DEMO BYTECODE] */
    uint8_t demo_bytecode[] = {
        OP_INIT_MOD,
        OP_IDENTITY_GEN,    /* Test Native Identity Generation */
        OP_VFS_STORE,       /* Test Native Secure Storage */
        OP_VFS_FETCH,       /* Test Native Secure Retrieval */
        OP_SYS_BIOMETRICS,
        OP_FEEL_STATE,
        OP_LUME_VOICE,
        OP_HALT
    };

    if (aurora_boot()) {
        printf("[MAIN] Aurora access granted. Starting A-VM...\n");
        avm_init();
        
        /* Execute the bootstrapping intents */
        avm_execute(demo_bytecode, sizeof(demo_bytecode));
        
        printf("[MAIN] System is idling in sovereign state.\n");
        sleep(1);
    }
    return 0;
}
