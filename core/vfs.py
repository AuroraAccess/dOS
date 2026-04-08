# NOTICE: This file is protected under RCF-PL v1.2.3
# [RCF:PROTECTED]
from .base import AuroraModule
from typing import Dict, Any, Optional, List
import time
import json
import base64
import os
from cryptography.fernet import Fernet

class VirtualFileSystem(AuroraModule):
    """
    [ВИРТУАЛЬНАЯ ПАМЯТЬ СИСТЕМЫ: VFS]
    VFS — это не просто файловая система, это объектное хранилище всей 
    информации в Aurora OS. Здесь нет файлов в привычном понимании, 
    есть только Объекты, каждый из которых имеет владельца и метаданные.
    
    Особенности:
    1. Автоматическое шифрование (AES-128/256 через Fernet).
    2. Персистентность (сохранение состояния на физический диск).
    3. Событийная модель (каждая запись генерирует системное событие).
    """
    def __init__(self):
        super().__init__("vfs")
        # Физическое место хранения данных — всегда в папке backend
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self._storage_file = os.path.join(base_dir, "backend", "vfs_storage.json")
        self._storage: Dict[str, Dict[str, Any]] = self._load_from_disk()
        
        # [СИСТЕМНЫЙ КЛЮЧ]
        # Используется для шифрования системных данных ядра.
        self._system_key = b'X0lch-l1F-CO68tfE7lNiVrAwb-SdUbyk0I9fuPrXv8='
        self._fernet = Fernet(self._system_key)

    def _load_from_disk(self) -> Dict[str, Any]:
        """Загрузка состояния VFS с диска при старте ядра."""
        if os.path.exists(self._storage_file):
            try:
                with open(self._storage_file, 'r') as f:
                    return json.load(f)
            except:
                return {} # Если файл поврежден, стартуем с чистой памятью
        return {}

    def _save_to_disk(self):
        """Синхронизация виртуальной памяти с физическим носителем."""
        try:
            with open(self._storage_file, 'w') as f:
                json.dump(self._storage, f)
        except Exception as e:
            print(f"[{self.name}] Failed to save VFS: {e}")

    async def initialize(self):
        print(f"[{self.name}] VFS initializing with {len(self._storage)} objects...")

    async def start(self):
        print(f"[{self.name}] VFS active. Persistence enabled.")
        # Подписываемся на системную загрузку, чтобы зафиксировать время бута
        self.subscribe("system:boot", self._on_boot)
        # Слушаем защищенные ANIML запросы от других модулей
        self.subscribe("muse:secure_vfs_request", self._on_animl_request)

    async def _on_animl_request(self, packet: str):
        """
        [ОБРАБОТКА ANIML ПАКЕТА]
        VFS принимает запечатанный пакет, декодирует его через UTP и исполняет.
        """
        decoded = self.bus.utp.decode_external("animl", packet)
        if decoded.get("event") == "animl:secure_transfer" and decoded.get("destination") == "vfs":
            data = decoded.get("payload")
            path = data.get("path")
            content = data.get("content")
            encrypt = data.get("encrypt", False)
            key = data.get("key")
            if key:
                key = key.encode() if isinstance(key, str) else key
            
            print(f"[{self.name}] Processing ANIML transfer from {decoded.get('source')}: {path}")
            await self.write(path, content, owner=decoded.get("source"), encrypt=encrypt, key=key)

    async def _on_boot(self, data):
        """Логируем факт успешной загрузки системы."""
        await self.write("/sys/kernel", {"boot_time": time.time(), "version": data.get("version")})

    def _encrypt(self, data: Any, key: Optional[bytes] = None) -> str:
        """Внутренняя механика шифрования объекта."""
        f = Fernet(key) if key else self._fernet
        json_data = json.dumps(data).encode()
        return f.encrypt(json_data).decode()

    def _decrypt(self, encrypted_data: str, key: Optional[bytes] = None) -> Any:
        """Внутренняя механика расшифровки объекта."""
        f = Fernet(key) if key else self._fernet
        decrypted_json = f.decrypt(encrypted_data.encode()).decode()
        return json.loads(decrypted_json)

    async def write(self, path: str, content: Any, owner: str = "system", encrypt: bool = False, key: Optional[bytes] = None):
        """
        [ЗАПИСЬ ОБЪЕКТА]
        Главный системный вызов для сохранения данных.
        Если encrypt=True, контент превращается в нечитаемый шум перед записью.
        """
        final_content = content
        is_encrypted = False
        
        if encrypt:
            try:
                final_content = self._encrypt(content, key)
                is_encrypted = True
            except Exception as e:
                print(f"[{self.name}] Encryption failed for {path}: {e}")
                return False

        # Формируем структуру объекта
        self._storage[path] = {
            "content": final_content,
            "metadata": {
                "owner": owner,
                "created_at": time.time(),
                "updated_at": time.time(),
                "encrypted": is_encrypted
            }
        }
        
        # Сохраняем на диск и оповещаем систему
        self._save_to_disk()
        await self.publish("file_created", {"path": path, "owner": owner, "encrypted": is_encrypted})
        return True

    async def read(self, path: str, key: Optional[bytes] = None) -> Optional[Dict[str, Any]]:
        """
        [ЧТЕНИЕ ОБЪЕКТА]
        Если объект зашифрован, чтение без правильного ключа вернет ошибку.
        Это основа безопасности данных пользователя в Aurora.
        """
        obj = self._storage.get(path)
        if not obj:
            return None
            
        if obj["metadata"].get("encrypted"):
            try:
                decrypted_content = self._decrypt(obj["content"], key)
                # Возвращаем расшифрованный контент в обертке метаданных
                return {
                    "content": decrypted_content,
                    "metadata": obj["metadata"]
                }
            except Exception as e:
                # Ошибка расшифровки (неверный ключ)
                return {"error": "Decryption failed. Invalid or missing key.", "metadata": obj["metadata"]}
        
        return obj

    async def list_dir(self, prefix: str):
        """Возвращает список всех путей, начинающихся с указанного префикса."""
        return [path for path in self._storage.keys() if path.startswith(prefix)]

    async def delete(self, path: str):
        """Удаление объекта из памяти и с диска."""
        if path in self._storage:
            del self._storage[path]
            self._save_to_disk()
            await self.publish("file_deleted", {"path": path})
            return True
        return False

# Инициализация VFS как синглтона
vfs_service = VirtualFileSystem()
