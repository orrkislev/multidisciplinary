// poisson_next.js
// Generate one Poisson-disk-valid point at least radius r from all existing points.
// - points: Array of [x,y]
// - r: minimum distance between points
// - k: number of attempts from a randomly chosen anchor (default 30)
// - bounds: optional {minX, minY, maxX, maxY} to constrain placement; omit for unbounded
// Returns: [x,y] or null if no valid point found after trying available anchors.

export function poissonNext(points, r, k = 30, bounds = null) {
    if (!Array.isArray(points) || points.length === 0) {
      // If no points yet, place the first one. If bounded, center; else origin.
      if (bounds) {
        const x = 0.5 * (bounds.minX + bounds.maxX);
        const y = 0.5 * (bounds.minY + bounds.maxY);
        return [x, y];
      }
      return [0, 0];
    }
  
    // Grid cell size so that any two points in neighboring cells could violate r
    const cellSize = r / Math.SQRT2;
  
    // Build grid index: map from "i,j" -> array of point indices
    const grid = new Map();
    const toCell = (x, y) => {
      const i = Math.floor(x / cellSize);
      const j = Math.floor(y / cellSize);
      return `${i},${j}`;
    };
  
    for (let idx = 0; idx < points.length; idx++) {
      const [x, y] = points[idx];
      const key = toCell(x, y);
      const arr = grid.get(key);
      if (arr) arr.push(idx);
      else grid.set(key, [idx]);
    }
  
    // Helper to check min-distance using grid neighborhood
    function isValidCandidate(cx, cy) {
      // If bounded, enforce
      if (bounds) {
        if (cx < bounds.minX || cx > bounds.maxX || cy < bounds.minY || cy > bounds.maxY) return false;
      }
  
      const ci = Math.floor(cx / cellSize);
      const cj = Math.floor(cy / cellSize);
  
      // Check 3x3 neighboring cells
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const key = `${ci + di},${cj + dj}`;
          const list = grid.get(key);
          if (!list) continue;
          for (const pi of list) {
            const [px, py] = points[pi];
            const dx = px - cx;
            const dy = py - cy;
            if (dx * dx + dy * dy < r * r) return false;
          }
        }
      }
      return true;
    }
  
    // Choose an anchor from existing points (random improves distribution)
    const anchor = points[Math.floor(Math.random() * points.length)];
  
    // Try k random candidates at distance in [r, 2r] from anchor
    for (let attempt = 0; attempt < k; attempt++) {
      const theta = Math.random() * Math.PI * 2;
      const dist = r * (1 + Math.random()); // uniformly in [r, 2r]
      const cx = anchor[0] + Math.cos(theta) * dist;
      const cy = anchor[1] + Math.sin(theta) * dist;
  
      if (isValidCandidate(cx, cy)) {
        return [cx, cy];
      }
    }
  
    // If all attempts failed for this anchor, optionally try more anchors
    const maxAnchors = Math.min(points.length, 20);
    for (let tries = 0; tries < maxAnchors; tries++) {
      const a = points[Math.floor(Math.random() * points.length)];
      for (let attempt = 0; attempt < k; attempt++) {
        const theta = Math.random() * Math.PI * 2;
        const dist = r * (1 + Math.random());
        const cx = a[0] + Math.cos(theta) * dist;
        const cy = a[1] + Math.sin(theta) * dist;
        if (isValidCandidate(cx, cy)) {
          return [cx, cy];
        }
      }
    }
  
    return null;
  }
  