from app.core.redis import get_redis


def check_rate_limit(key: str, limit: int, window_seconds: int = 60) -> None:
    r = get_redis()
    current = r.incr(key)
    if current == 1:
        r.expire(key, window_seconds)
    if current > limit:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")
