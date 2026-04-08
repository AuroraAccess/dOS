/* [RCF:PROTECTED] */

#ifndef DOS_BRIDGE_H
#define DOS_BRIDGE_H

#include "opcode.h"

/**
 * [AURORA dOS BRIDGE: ARM64 TRANSITION]
 * 
 * Универсальный интерфейс для связи Тела и Разума.
 */

void dos_trigger_intent(uint8_t opcode, const void* payload, size_t size);

static inline void dos_sync_biometrics(uint32_t bpm, uint32_t oxygen) {
    (void)oxygen; // Предотвращаем ворнинг компилятора
    dos_trigger_intent(0x50, &bpm, sizeof(bpm));
}

#endif /* DOS_BRIDGE_H */
