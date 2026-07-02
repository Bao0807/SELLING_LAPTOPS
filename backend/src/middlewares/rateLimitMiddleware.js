const buckets = new Map();

const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 30 } = {}) => {
  return (req, res, next) => {
    const key = `${req.ip}:${req.originalUrl}`;
    const now = Date.now();
    const entry = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (entry.resetAt <= now) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    buckets.set(key, entry);

    if (entry.count > max) {
      return res.status(429).json({ success: false, message: 'Too many requests, please try again later' });
    }

    next();
  };
};

module.exports = { rateLimit };
