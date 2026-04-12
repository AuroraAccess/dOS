# NOTICE: This file is protected under RCF-PL v1.3
# [RCF:PROTECTED]
from .base import AuroraModule
from .vfs import vfs_service
from .identity import identity_service
import time

class MuseService(AuroraModule):
    """
    [МУЗА СИСТЕМЫ: MUSA]
    Muse — это не просто валидатор кода или сканер паттернов. Это источник
    вдохновения и творческого порядка внутри Aurora OS.
    
    Она следит за гармонией системы, превращая сухие инструкции в 
    эстетически выверенный поток цифрового бытия.
    """
    def __init__(self):
        super().__init__("muse")
        self.identity = identity_service
        self.vfs = vfs_service

    async def initialize(self):
        print(f"[{self.name}] Service initializing...")

    async def start(self):
        print(f"[{self.name}] Service started.")
        
        # [ПОДПИСКИ]
        # Muse слушает ключевые события системы для анализа
        self.subscribe("identity:created", self._on_identity_created)
        self.subscribe("system:boot", self._on_system_boot)
        self.subscribe("vfs:file_created", self._on_vfs_action)

    async def _on_vfs_action(self, data):
        """
        [АНАЛИЗ ДЕЙСТВИЙ В VFS]
        Каждый раз, когда в VFS пишется файл, Muse фиксирует это.
        """
        path = data.get("path")
        owner = data.get("owner")
        
        # [ЗАЩИТА ОТ РЕКУРСИИ]
        # Мы не логируем саму запись логов, иначе система уйдет в бесконечный цикл.
        if path.startswith("/sys/logs/muse") or "/muse/logs/" in path or path.startswith("/sys"):
            return

        # Пытаемся понять, какой пользователь совершил действие
        user_id = None
        if path.startswith("/users/"):
            parts = path.split("/")
            if len(parts) > 2:
                user_id = parts[2]

        log_entry = {
            "timestamp": time.time(),
            "action": "vfs_write",
            "path": path,
            "owner": owner
        }

        # [ПРИВАТНОЕ ЛОГИРОВАНИЕ]
        # Если действие совершил пользователь, лог шифруется ЕГО ключом.
        # Даже админ не сможет прочитать, что делал пользователь.
        if user_id:
            user_key = self.identity.get_user_key(user_id)
            log_path = f"/users/{user_id}/muse/logs/{time.time()}"
            await self.vfs.write(log_path, log_entry, owner=self.name, encrypt=True, key=user_key)
            print(f"[{self.name}] Encrypted action logged for user {user_id}: {path}")
        else:
            # Системные логи ядра (пишутся открыто для админа)
            await self.vfs.write(f"/sys/logs/muse/{time.time()}", log_entry, owner=self.name)

    async def _on_system_boot(self, data):
        print(f"[{self.name}] Learning system ready for version {data.get('version')}")

    async def _on_identity_created(self, data):
        """
        [НОВАЯ ЛИЧНОСТЬ]
        Когда создается новый Aurora ID, Muse инициализирует файл паттернов.
        Использует нативный протокол ANIML для безопасной передачи данных в VFS.
        """
        user_id = data.get("id")
        user_key = self.identity.get_user_key(user_id)
        print(f"[{self.name}] New identity detected: {user_id}. Initializing profile via ANIML...")
        
        # Начальный профиль обучения
        pattern_data = {
            "user_id": user_id,
            "created_at": time.time(),
            "interactions": 0,
            "status": "new_identity"
        }
        
        # [SOLDERED TRANSFER]
        # Вместо обычного вызова VFS, мы запечатываем данные в ANIML пакет
        vfs_path = f"/users/{user_id}/muse/patterns"
        animl_packet = self.bus.utp.create_animl_packet(src=self.name, dst="vfs", body={
            "path": vfs_path,
            "content": pattern_data,
            "encrypt": True,
            "key": user_key.decode() if isinstance(user_key, bytes) else user_key
        })
        
        # Публикуем пакет в шину. VFS должен уметь его распознать.
        await self.publish("secure_vfs_request", animl_packet)
        
        await self.publish("monitoring_active", {"user_id": user_id, "vfs_path": vfs_path, "encrypted": True})

# Экземпляр сервиса
muse_service = MuseService()
