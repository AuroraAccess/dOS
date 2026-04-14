# NOTICE: This file is protected under RCF-PL v1.3
import subprocess
import json
import asyncio
import os
import sys

# Добавляем путь для импорта системы Aurora
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.bus import system_bus

class AuroraBridgeGateway:
    """
    [ИНТЕГРАЦИОННЫЙ ШЛЮЗ]
    Этот класс запускает C-Core (солдата) и транслирует его 
    JSON-события в высокоуровневую шину Aurora.
    """
    def __init__(self, binary_path="./aurora_core"):
        self.binary_path = binary_path
        self.process = None

    async def run(self):
        print(f"[BRIDGE] Awakening the C-Core at {self.binary_path}...")
        
        # Запускаем бинарный файл как подпроцесс
        self.process = await asyncio.create_subprocess_exec(
            self.binary_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=os.path.dirname(os.path.abspath(self.binary_path))
        )

        # Читаем вывод построчно
        while True:
            line = await self.process.stdout.readline()
            if not line:
                break
            
            clean_line = line.decode().strip()
            try:
                # Пытаемся распарсить JSON из C-Core
                if clean_line.startswith("{"):
                    event = json.loads(clean_line)
                    event_type = event.get("type")
                    data = event.get("data")
                    
                    # Маппинг событий на системную шину (Универсальный Мост)
                    if event_type == "BIOMETRICS":
                        await system_bus.publish("pulse:biometrics", data)
                    elif event_type == "SENTIENCE":
                        await system_bus.publish("sentience:feel", data)
                    elif event_type == "LUME":
                        await system_bus.publish("lume:voice", data)
                    
                    print(f"[BRIDGE] Relayed {event_type} from C-Core to UI.")
                else:
                    # Обычные логи ядра (не JSON)
                    print(f"[C-LOG] {clean_line}")
                    
            except json.JSONDecodeError:
                print(f"[C-LOG] {clean_line}")

        await self.process.wait()
        print("[BRIDGE] C-Core went to sleep.")

if __name__ == "__main__":
    gateway = AuroraBridgeGateway()
    asyncio.run(gateway.run())
