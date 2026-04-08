/* [RCF:PROTECTED] */

#ifndef BUS_H
#define BUS_H

#include <stddef.h>
#include <stdbool.h>
#include "kernel.h"

#define MAX_EVENT_NAME 32
#define MAX_PACKET_SIZE 512

typedef void (*BusCallback)(const char* event, const void* data);

/* System Bus API */
bool bus_init(void);
void bus_publish(const char* event, const void* data);
bool bus_subscribe(const char* event, BusCallback callback);

/* Universal Translator Protocol (UTP/ANIML) */
void utp_wrap_animl(const char* src, const char* dst, const char* body, char* out_packet);
bool utp_unwrap_animl(const char* raw_packet, char* out_body);

#endif /* BUS_H */
