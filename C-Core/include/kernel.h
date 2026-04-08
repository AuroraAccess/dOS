/* [RCF:PROTECTED] */

#ifndef KERNEL_H
#define KERNEL_H

#include <stdbool.h>
#include "opcode.h"
#include "aurora_config.h"

typedef enum {
    KERNEL_STATE_OFFLINE,
    KERNEL_STATE_BOOTING,
    KERNEL_STATE_READY,
    KERNEL_STATE_PANIC
} KernelState;

typedef struct {
    const char* name;
    bool (*init)(void);
    bool (*start)(void);
    Version version;
} AuroraModule;

typedef struct {
    KernelState state;
    uint32_t session_id;
    bool sentience_active;
} AuroraKernel;

/* SYSTEM API */
bool aurora_boot(void);
void aurora_shutdown(void);
bool aurora_panic(const char* reason);

#endif /* KERNEL_H */
