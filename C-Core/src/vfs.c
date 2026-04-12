/* NOTICE: This file is protected under RCF-PL v1.3
 * [RCF:PROTECTED]
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "vfs.h"

/* SYSTEM KEY FOR SOVEREIGN OBFUSCATION */
static uint8_t g_vfs_key[] = { 0x41, 0x55, 0x52, 0x4F, 0x52, 0x41, 0x5F, 0x4B, 0x45, 0x59 };

void _vfs_crypt_logic(uint8_t* data, size_t size) {
    for (size_t i = 0; i < size; i++) {
        data[i] ^= g_vfs_key[i % sizeof(g_vfs_key)];
    }
}

bool vfs_init() {
    printf("[VFS:NATIVE] Initializing sovereign storage at %s...\n", VFS_STORAGE_FILE);
    return true;
}

bool vfs_write(const char* path, const void* data, size_t size, bool encrypt) {
    FILE* f = fopen(path, "wb");
    if (!f) return false;

    uint8_t* buffer = malloc(size);
    memcpy(buffer, data, size);

    if (encrypt) {
        _vfs_crypt_logic(buffer, size);
    }

    fwrite(buffer, 1, size, f);
    fclose(f);
    free(buffer);

    printf("[VFS:NATIVE] Object saved: %s (%zu bytes, encrypted: %d)\n", path, size, encrypt);
    return true;
}

void* vfs_read(const char* path, size_t* out_size) {
    FILE* f = fopen(path, "rb");
    if (!f) return NULL;

    fseek(f, 0, SEEK_END);
    *out_size = ftell(f);
    fseek(f, 0, SEEK_SET);

    uint8_t* buffer = malloc(*out_size);
    fread(buffer, 1, *out_size, f);
    fclose(f);

    /* For demonstration, we assume data was encrypted during write */
    _vfs_crypt_logic(buffer, *out_size);

    return buffer;
}

bool vfs_delete(const char* path) {
    return remove(path) == 0;
}
