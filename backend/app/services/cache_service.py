from __future__ import annotations

import json
import logging
from functools import wraps

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_redis_client = None


def _get_redis():
    """Lazy-load Redis with graceful fallback."""
    global _redis_client
    if _redis_client is None:
        try:
            import redis as redis_module
            settings = get_settings()
            _redis_client = redis_module.from_url(settings.redis_url, socket_connect_timeout=2)
            _redis_client.ping()
            logger.info("Redis cache connected at %s", settings.redis_url)
        except ImportError:
            _redis_client = False
            logger.info("Redis not installed — caching disabled")
        except Exception:
            _redis_client = False
            logger.info("Redis unavailable — caching disabled (start Redis to enable)")
    return _redis_client if _redis_client is not False else None


def cache_result(ttl_seconds: int = 60):
    """Decorator to cache function results in Redis. Falls back gracefully if Redis is down."""

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            redis = _get_redis()
            if not redis:
                return func(*args, **kwargs)

            key = f"cache:{func.__name__}:{hash(str(args) + str(kwargs))}"
            try:
                cached = redis.get(key)
                if cached:
                    return json.loads(cached)
            except Exception:
                pass

            result = func(*args, **kwargs)
            try:
                redis.setex(key, ttl_seconds, json.dumps(result, default=str))
            except Exception:
                pass

            return result

        return wrapper

    return decorator


def invalidate_cache(pattern: str = "cache:*"):
    """Clear cached keys matching pattern."""
    redis = _get_redis()
    if not redis:
        return
    try:
        keys = redis.keys(pattern)
        if keys:
            redis.delete(*keys)
            logger.debug("Invalidated %d cache keys matching %s", len(keys), pattern)
    except Exception:
        pass
