/* [RCF:PROTECTED] */

#ifndef VM_H
#define VM_H

#include <stddef.h>
#include "kernel.h"

typedef struct {
    double bpm;
    double adrenaline;
    double oxygen;
    const char* emotional_state;
} SentienceState;

/* A-VM API */
void avm_init(void);
void avm_execute(const uint8_t* bytecode, size_t length);

/* Internal Cognitive Handlers */
void _op_feel_state(void);
void _op_lume_voice(void);
void _op_sys_biometrics(void);

#endif /* VM_H */
