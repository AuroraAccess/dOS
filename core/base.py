# NOTICE: This file is protected under RCF-PL v1.3
# [RCF:PROTECTED]
from abc import ABC, abstractmethod
from typing import Any
from .bus import system_bus

class AuroraModule(ABC):
    """
    [АНАТОМИЯ МОДУЛЯ AURORA]
    AuroraModule — это абстрактный фундамент, на котором строятся все сервисы системы.
    В отличие от классических ОС, где модули общаются через системные вызовы напрямую,
    в Aurora каждый модуль изолирован и взаимодействует с миром только через Event Bus.
    """
    def __init__(self, name: str):
        # Уникальное имя модуля (например, 'vfs', 'muse', 'identity')
        self.name = name
        # Доступ к глобальной шине событий для межмодульного общения
        self.bus = system_bus

    @abstractmethod
    async def initialize(self):
        """
        [ЭТАП 1: ИНИЦИАЛИЗАЦИЯ]
        Здесь модуль подготавливает свои внутренние структуры, загружает конфиги 
        или проверяет зависимости. На этом этапе шина еще не запущена для всех.
        """
        pass

    @abstractmethod
    async def start(self):
        """
        [ЭТАП 2: ЗАПУСК]
        Модуль официально входит в рабочий цикл. Здесь обычно происходит 
        подписка на события других модулей (self.subscribe).
        """
        pass

    async def publish(self, event_type: str, data: Any):
        """
        [ОТПРАВКА СИГНАЛА]
        Модуль сообщает системе о чем-то важном.
        Префикс '{self.name}:' добавляется автоматически для идентификации источника.
        Пример: 'vfs:file_created'
        """
        await self.bus.publish(f"{self.name}:{event_type}", data)

    def subscribe(self, event_type: str, callback: Any):
        """
        [ПРИЕМ СИГНАЛА]
        Модуль выражает интерес к событиям определенного типа.
        Когда событие произойдет, вызовется указанный callback (функция).
        """
        self.bus.subscribe(event_type, callback)
