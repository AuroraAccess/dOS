# AURORA CORE MAKEFILE
# Strategy: Unified C-Core (Phase 18)

CC = gcc
CFLAGS = -Iinclude -Wall -Wextra -O2
SRC_DIR = src
OBJ_DIR = obj
INC_DIR = include

# Target Binary
TARGET = aurora_core

# Source Files
SRCS = $(SRC_DIR)/kernel.c $(SRC_DIR)/vm.c $(SRC_DIR)/vfs.c $(SRC_DIR)/identity.c $(SRC_DIR)/bus.c
OBJS = $(OBJ_DIR)/kernel.o $(OBJ_DIR)/vm.o $(OBJ_DIR)/vfs.o $(OBJ_DIR)/identity.o $(OBJ_DIR)/bus.o

# Build Rules
all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET)
	@echo "--- AURORA CORE BUILD COMPLETE ---"

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(OBJ_DIR) $(TARGET)
	@echo "--- CLEANED ---"

run: all
	./$(TARGET)
