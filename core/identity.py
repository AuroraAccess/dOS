# NOTICE: This file is protected under RCF-PL v1.3
# [RCF:PROTECTED]
import secrets
from cryptography.fernet import Fernet
from .base import AuroraModule

class IdentityManager(AuroraModule):
    """
    [ФУНДАМЕНТ ДОВЕРИЯ: IDENTITY MANAGER]
    Этот модуль управляет созданием личностей (Aurora ID) и их ключами.
    В Aurora ID личность — это не просто логин, это криптографический корень,
    который определяет права доступа ко всем данным в VFS.
    """
    def __init__(self):
        super().__init__("identity")
        # Привязка системных ролей к доменам
        self.domains = {
            "auth": "auroraid.site",      # Сервис аутентификации
            "portal": "auroraaccess.site" # Пользовательский интерфейс
        }
        # [ХРАНИЛИЩЕ КЛЮЧЕЙ]
        # { user_id: bytes(fernet_key) }
        # В прототипе хранится в памяти, в будущем — в защищенном анклаве.
        self._user_keys: dict[str, bytes] = {}

    async def initialize(self):
        print(f"Module '{self.name}' initialized.")

    async def start(self):
        print(f"Module '{self.name}' started.")
        # Слушаем загрузку системы для внутренней проверки
        self.subscribe("system:boot", self._on_system_boot)

    async def _on_system_boot(self, data):
        print(f"[{self.name}] System boot detected. Version: {data.get('version')}")

    def generate_id(self, user_prefix: str = "user") -> str:
        """
        Генерация уникального Aurora ID.
        Использует криптографически стойкий генератор secrets.
        """
        key = secrets.token_urlsafe(24)
        aurora_id = f"aurora_{user_prefix}_{key}"
        return aurora_id

    def get_user_key(self, user_id: str) -> bytes:
        """
        [МЕНЕДЖМЕНТ КЛЮЧЕЙ]
        Возвращает ключ шифрования для конкретного ID.
        Если ключа нет — создает его (первая инициализация).
        """
        if user_id not in self._user_keys:
            # [СПЕЦИАЛЬНОЕ ПРАВИЛО ДЛЯ ALADDIN]
            # Для обеспечения персистентности тестов главного разработчика.
            if user_id == "Aladdin":
                self._user_keys[user_id] = b'X0lch-l1F-CO68tfE7lNiVrAwb-SdUbyk0I9fuPrXv8='
            else:
                # Генерация случайного ключа для нового пользователя
                self._user_keys[user_id] = Fernet.generate_key()
        return self._user_keys[user_id]

    async def register_session(self, user_prefix: str):
        """
        [РЕГИСТРАЦИЯ НОВОЙ СЕССИИ]
        Создает новый ID, выпускает ключ и оповещает систему.
        """
        new_id = self.generate_id(user_prefix)
        # Инициализируем ключ сразу
        self.get_user_key(new_id)
        
        # Публикуем событие создания новой личности
        await self.publish("created", {
            "id": new_id,
            "domain": self.domains["auth"],
            "timestamp": "now"
        })
        return new_id

# Инициализация синглтона сервиса
identity_service = IdentityManager()
