"""Semantic portable submission contract mirrored in src/recordContract.ts."""


def merge_submission(a, b):
    if any(a.get(k) != b.get(k) for k in ('session', 'exercise', 'answer', 'correct')):
        raise ValueError('Conflicting submission')
    if a.get('response_mode') and b.get('response_mode') and a['response_mode'] != b['response_mode']:
        raise ValueError('Conflicting response mode')
    result = {**b, **a}
    for key in ('response_mode', 'created_at'):
        if a.get(key) or b.get(key):
            result[key] = a.get(key) or b.get(key)
    for key in ('hints_used', 'active_seconds'):
        result[key] = max(a.get(key) or 0, b.get(key) or 0)
    return result
