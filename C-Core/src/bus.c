/* NOTICE: This file is protected under RCF-PL v1.3
 * [RCF:PROTECTED]
 */

#include <stdio.h>
#include <string.h>
#include "bus.h"

bool bus_init() {
    printf("[BUS:NATIVE] Sovereign Bus active. UTP Protocol loaded.\n");
    return true;
}

void bus_publish(const char* event, const void* data) {
    /* [SOLDERED DISPATCHER] 
     * In a pure C kernel, we dispatch events directly to linked modules 
     * to avoid memory overhead of dynamic subscriptions.
     */
    if (strcmp(event, "vfs:file_created") == 0) {
        printf("[BUS] Broadcast -> VFS Object Created.\n");
    } else if (strcmp(event, "identity:created") == 0) {
        printf("[BUS] Broadcast -> Identity Activated: %s\n", (const char*)data);
    }
}

void utp_wrap_animl(const char* src, const char* dst, const char* body, char* out_packet) {
    /* [ANIML v1 PACKAGING]
     * Format: ANIML_v1:[SRC->DST]:BODY
     */
    sprintf(out_packet, "ANIML_v1:[%s->%s]:%s", src, dst, body);
    printf("[UTP] Sealed Packet: %s\n", out_packet);
}

bool utp_unwrap_animl(const char* raw_packet, char* out_body) {
    if (strncmp(raw_packet, "ANIML_v1:", 9) != 0) return false;
    
    /* Simple parser: extract data after the last colon */
    const char* data_ptr = strrchr(raw_packet, ':');
    if (data_ptr) {
        strcpy(out_body, data_ptr + 1);
        return true;
    }
    return false;
}
