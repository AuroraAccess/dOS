/* [RCF:PROTECTED] */

#ifndef IDENTITY_H
#define IDENTITY_H

#include <stddef.h>
#include <stdbool.h>
#include "kernel.h"

#define MAX_ID_LEN 64
#define MASTER_KEY "X0lch-l1F-CO68tfE7lNiVrAwb-SdUbyk0I9fuPrXv8="

typedef struct {
    char aurora_id[MAX_ID_LEN];
    char user_key[64];
    bool is_active;
} AuroraIdentity;

/* Identity API */
bool identity_init(void);
const char* identity_generate(const char* prefix);
const char* identity_get_key(const char* user_id);

#endif /* IDENTITY_H */
