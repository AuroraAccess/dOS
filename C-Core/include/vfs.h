/* [RCF:PROTECTED] */

#ifndef VFS_H
#define VFS_H

#include <stdbool.h>
#include <stddef.h>
#include "kernel.h"

#define VFS_MAX_PATH 256
#define VFS_STORAGE_FILE "vfs_storage.bin"

typedef struct {
    char path[VFS_MAX_PATH];
    size_t size;
    bool encrypted;
    uint32_t timestamp;
} VFSMetadata;

/* VFS API */
bool vfs_init(void);
bool vfs_write(const char* path, const void* data, size_t size, bool encrypt);
void* vfs_read(const char* path, size_t* out_size);
bool vfs_delete(const char* path);

/* Internal Security */
void _vfs_crypt_logic(uint8_t* data, size_t size);

#endif /* VFS_H */
