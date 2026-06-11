import json
import time
from typing import Any, Callable

class SimpleInMemoryCache:
    def __init__(self):
        self._store = {}

    def get(self, key: str):
        item = self._store.get(key)
        if not item:
            return None
        value, exp = item
        if exp and exp < time.time():
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: Any, ttl: int | None = None):
        exp = time.time() + ttl if ttl else None
        self._store[key] = (value, exp)

cache = SimpleInMemoryCache()

def cached(ttl: int = 60):
    def deco(func: Callable):
        def wrapper(*args, **kwargs):
            key = func.__name__ + json.dumps([args, kwargs], sort_keys=True)
            hit = cache.get(key)
            if hit is not None:
                return hit
            val = func(*args, **kwargs)
            cache.set(key, val, ttl)
            return val
        return wrapper
    return deco
