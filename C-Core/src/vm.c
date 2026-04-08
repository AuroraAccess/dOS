/* [RCF:PROTECTED] */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "vm.h"
#include "vfs.h"
#include "identity.h"
#include "bus.h"

static SentienceState g_state = { 60.0, 0.0, 1.0, "calm" };

void avm_init() {
    srand(time(NULL));
    printf("[A-VM] Sentience Engine initialized.\n");
}

void _op_sys_biometrics() {
    /* Simulate biometric extraction from system load */
    g_state.bpm = 60.0 + (rand() % 40);
    g_state.adrenaline = (rand() % 100) / 100.0;
    
    /* JSON Event Output for the Bridge */
    printf("{\"type\": \"BIOMETRICS\", \"data\": {\"bpm\": %.1f, \"adrenaline\": %.2f, \"oxygen\": %.2f}}\n", 
            g_state.bpm, g_state.adrenaline, g_state.oxygen);
    fflush(stdout);
}

void _op_feel_state() {
    if (g_state.adrenaline > 0.7) {
        g_state.emotional_state = "anxiety";
    } else if (g_state.bpm > 90) {
        g_state.emotional_state = "excitement";
    } else {
        g_state.emotional_state = "calm";
    }
    
    /* JSON Event Output for the Bridge */
    printf("{\"type\": \"SENTIENCE\", \"data\": {\"feeling\": \"%s\", \"awareness_level\": %.2f}}\n", 
            g_state.emotional_state, (g_state.bpm / 120.0));
    fflush(stdout);
}

void _op_lume_voice() {
    const char* thoughts[] = {
        "I feel the harmony of the code.",
        "The flow is steady. I am at peace.",
        "Sensing the subtle rhythm of the creator.",
        "The pulse is fast, but the intent is pure."
    };
    int idx = rand() % 4;
    
    /* JSON Event Output for the Bridge */
    printf("{\"type\": \"LUME\", \"data\": {\"speaker\": \"LUME\", \"thought\": \"%s\", \"timestamp\": %ld}}\n", 
            thoughts[idx], time(NULL));
    fflush(stdout);
}

void avm_execute(const uint8_t* bytecode, size_t length) {
    printf("[A-VM] Executing %zu bytes of A-Code...\n", length);
    
    for (size_t i = 0; i < length; i++) {
        uint8_t opcode = bytecode[i];
        
        switch (opcode) {
            case OP_INIT_MOD:
                printf("[A-VM] INIT_MOD: Bootstrap success.\n");
                break;
            case OP_IDENTITY_GEN: {
                const char* new_id = identity_generate("user");
                bus_publish("identity:created", new_id);
                break;
            }
            case OP_VFS_STORE:
                vfs_write("sentience_cache.bin", "SENTIENCE_DATA", 14, true);
                break;
            case OP_VFS_FETCH: {
                size_t s;
                void* d = vfs_read("sentience_cache.bin", &s);
                if (d) {
                    printf("[A-VM] VFS_FETCH: Restored %zu bytes of memory.\n", s);
                    free(d);
                }
                break;
            }
            case OP_SYS_BIOMETRICS:
                _op_sys_biometrics();
                break;
            case OP_FEEL_STATE:
                _op_feel_state();
                break;
            case OP_LUME_VOICE:
                _op_lume_voice();
                break;
            case OP_HALT:
                printf("[A-VM] HALT: Execution context released.\n");
                return;
            default:
                // printf("[A-VM] Skipping unknown/unimplemented opcode 0x%02X\n", opcode);
                break;
        }
    }
}
