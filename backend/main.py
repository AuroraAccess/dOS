# NOTICE: This file is protected under RCF-PL v1.2.3
# [RCF:PROTECTED]
import asyncio
import json
import os
import sys
from typing import Any, List, Optional

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Добавляем корневую директорию в путь для импорта core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.kernel import AuroraKernel
from core.identity import identity_service
from core.vfs import vfs_service
from core.bus import system_bus
from C_Core.bridge_gateway import AuroraBridgeGateway

app = FastAPI(title='Aurora Access — dOS Kernel API')

# Список разрешенных доменов для CORS
origins = [
    "http://auroraaccess.site",
    "http://auroraaccess.site:8000",
    "http://auroraaccess.site:3000",
    "http://auroraid.site",
    "http://auroraid.site:8000",
    "http://auroraid.site:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация ядра
kernel = AuroraKernel()

@app.on_event("startup")
async def startup_event():
    # [C-CORE BRIDGE ACTIVATION]
    # Запускаем новое C-ядро через шлюз. 
    # Старое Python-ядро будет запущено параллельно или заменено.
    gateway = AuroraBridgeGateway(binary_path="./C-Core/aurora_core")
    asyncio.create_task(gateway.run())
    
    # asyncio.create_task(kernel.boot())

class AuroraCreateResp(BaseModel):
    aurora_id: str
    message: str
    domain: str

@app.get("/")
async def root(request: Request):
    host = request.headers.get("host")
    if "auroraid.site" in host:
        return {"service": "Identity Service", "domain": "auroraid.site", "status": "active"}
    elif "auroraaccess.site" in host:
        return {"service": "Aurora Access Portal", "domain": "auroraaccess.site", "status": "active"}
    return {"message": "Aurora dOS Kernel is running", "host": host}

@app.get('/api/health')
async def health():
    return {"status": "ok", "kernel_version": kernel.version}

@app.post('/api/aurora/create', response_model=AuroraCreateResp)
async def create_aurora(request: Request):
    # [A-CODE MIGRATION]
    # Теперь регистрация сессии выполняется через нативный байт-код A-Code
    registration_script = [
        {"op": 0x01, "data": "ExternalRequest"},
        {"op": 0x05, "data": {"prefix": "user"}}, # IDENTITY_GEN
        {"op": 0x20, "data": {"event": "web_access", "payload": "New session via A-Code"}},
        {"op": 0x99, "data": None}
    ]
    
    # Исполняем скрипт через виртуальную машину ядра
    await kernel.vm.execute("WebPortal", registration_script)
    
    # Для совместимости с текущим фронтендом возвращаем данные напрямую
    new_id = await identity_service.register_session("user") 
    return {
        "aurora_id": new_id,
        "message": "Aurora ID activated via A-Code Native Execution",
        "domain": identity_service.domains["auth"]
    }

@app.get("/api/sys/events")
async def event_stream(request: Request):
    """
    [ПУЛЬС СИСТЕМЫ]
    SSE-стрим всех событий системной шины. Позволяет фронтенду 
    видеть 'жизнь' ядра в реальном времени.
    """
    async def event_generator():
        queue = asyncio.Queue()
        
        # Запоминаем текущий работающий цикл
        loop = asyncio.get_running_loop()
        
        # Подписываемся на события шины
        def listener(data):
            # Используем call_soon_threadsafe если это придет из другого потока
            loop.call_soon_threadsafe(queue.put_nowait, data)

        # Слушаем основные каналы
        system_bus.subscribe("vfs:file_created", lambda d: listener({"type": "VFS", "data": d}))
        system_bus.subscribe("muse:secure_vfs_request", lambda d: listener({"type": "ANIML", "data": d}))
        system_bus.subscribe("identity:created", lambda d: listener({"type": "IDENTITY", "data": d}))
        system_bus.subscribe("pulse:pulse", lambda d: listener({"type": "PULSE", "data": d}))
        system_bus.subscribe("pulse:biometrics", lambda d: listener({"type": "BIOMETRICS", "data": d}))
        system_bus.subscribe("sentience:feel", lambda d: listener({"type": "SENTIENCE", "data": d}))
        system_bus.subscribe("instinct:action", lambda d: listener({"type": "INSTINCT", "data": d}))
        system_bus.subscribe("reflex:activation", lambda d: listener({"type": "REFLEX", "data": d}))
        system_bus.subscribe("intuition:predict", lambda d: listener({"type": "INTUITION", "data": d}))
        system_bus.subscribe("awareness:summary", lambda d: listener({"type": "AWARENESS", "data": d}))
        system_bus.subscribe("consciousness:manifest", lambda d: listener({"type": "WILL", "data": d}))
        system_bus.subscribe("muse:insight", lambda d: listener({"type": "INSIGHT", "data": d}))
        system_bus.subscribe("lume:voice", lambda d: listener({"type": "LUME", "data": d}))
        system_bus.subscribe("lume:suggestions", lambda d: listener({"type": "SUGGESTIONS", "data": d}))
        system_bus.subscribe("purity:report", lambda d: listener({"type": "PURITY", "data": d}))
        system_bus.subscribe("logic:evolution", lambda d: listener({"type": "EVOLUTION", "data": d}))
        system_bus.subscribe("awareness:reflection", lambda d: listener({"type": "REFLECTION", "data": d}))
        system_bus.subscribe("flow:in", lambda d: listener({"type": "FLOW", "data": d}))
        system_bus.subscribe("flow:out", lambda d: listener({"type": "FLOW", "data": d}))
        
        try:
            while True:
                if await request.is_disconnected():
                    break
                
                event = await queue.get()
                yield f"data: {json.dumps(event)}\n\n"
        except asyncio.CancelledError:
            pass

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# Virtual File System API
class VFSWriteReq(BaseModel):
    path: str
    content: Any

@app.post("/api/vfs/write")
async def vfs_write(req: VFSWriteReq):
    encrypt = False
    key = None
    
    if req.path.startswith("/users/"):
        parts = req.path.split("/")
        if len(parts) > 3 and parts[3] == "vault":
            user_id = parts[2]
            key = identity_service.get_user_key(user_id)
            encrypt = True
            
    await vfs_service.write(req.path, req.content, encrypt=encrypt, key=key)
    return {"status": "success", "path": req.path, "encrypted": encrypt}

@app.get("/api/vfs/read")
async def vfs_read(path: str, user_id: Optional[str] = None):
    key = None
    if user_id:
        key = identity_service.get_user_key(user_id)
    
    data = await vfs_service.read(path, key=key)
    if not data:
        return {"error": "Object not found"}
    return data

@app.get("/api/vfs/list")
async def vfs_list(prefix: str = "/", admin_token: Optional[str] = None):
    if prefix.startswith("/sys/logs") and admin_token != "aurora_root_key":
        return {"error": "Unauthorized. Admin access required for system logs."}
        
    items = await vfs_service.list_dir(prefix)
    return {"prefix": prefix, "items": items}

# Silence dev tools noise (Vite, Proxy, etc.)
@app.api_route("/{path:path}", methods=["GET", "POST"])
async def catch_all_silencer(request: Request, path: str):
    if "@vite" in path or "sockjs-node" in path:
        return {"status": "silenced", "path": path}
    return {"message": "Not Found", "path": path}

if __name__ == "__main__":
    port = 8000
    if "--port" in sys.argv:
        port = int(sys.argv[sys.argv.index("--port") + 1])
    uvicorn.run(app, host="0.0.0.0", port=port)
