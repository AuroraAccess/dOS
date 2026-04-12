/* NOTICE: This file is protected under RCF-PL v1.3
 * [RCF:PUBLIC]
 */

#ifndef OPCODE_H
#define OPCODE_H

#include <stdint.h>

/*
 * AURORA UNIVERSAL OPCODE TABLE
 * Shared between ARM64-core and C-Core (Aurora Access)
 */

typedef uint8_t OpCode;

#define OP_INIT_MOD          0x01
#define OP_IDENTITY_GEN      0x05

#define OP_VFS_STORE         0x10
#define OP_VFS_FETCH         0x11

#define OP_BUS_PUB           0x20
#define OP_BUS_SUB           0x21

#define OP_UTP_TRANS         0x30

#define OP_PULSE_EMIT        0x40
#define OP_SYS_BIOMETRICS    0x50  /* [SYNCHRONIZED] */

#define OP_FEEL_STATE        0x45  /* [SYNCHRONIZED] */
#define OP_INSTINCT_TRIGGER  0x60
#define OP_REFLEX_ACTION     0x65
#define OP_INTUITION_PREDICT 0x70
#define OP_MUSE_INSIGHT      0x75
#define OP_MANIFEST          0x80
#define OP_REFLECT           0x88

#define OP_FLOW_IN           0x90
#define OP_FLOW_OUT          0x91

#define OP_LUME_VOICE        0xA0
#define OP_LUME_SUGGEST      0xA5

#define OP_UART_GETC         0xB0
#define OP_UART_PUTC         0xB1

#define OP_EVOLVE_LOGIC      0xEE
#define OP_PQC_VERIFY        0xFE
#define OP_PURITY_VERIFY     0xFF
#define OP_SYS_CHAOS         0xCC

#define OP_HALT              0x00  /* [SYNCHRONIZED] */

#endif /* OPCODE_H */
