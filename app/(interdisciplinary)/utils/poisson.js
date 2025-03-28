export default function poisson(n, r) {
    // Initialize with first point at origin
    const points = [{x: 0, y: 0}];
    
    // Active list for candidate points
    const activeList = [0];
    
    // Keep generating points until we have n points or no more candidates
    while (points.length < n && activeList.length > 0) {
      // Pick a random index from active list
      const randomIndex = Math.floor(Math.random() * activeList.length);
      const pointIndex = activeList[randomIndex];
      const point = points[pointIndex];
      
      // Try to find a valid new point near this one
      let found = false;
      for (let i = 0; i < 30; i++) { // Limit attempts per point
        // Generate a random point between r and 2r away
        const angle = Math.random() * Math.PI * 2;
        const distance = r + Math.random() * r;
        
        const newPoint = {
          x: point.x + Math.cos(angle) * distance,
          y: point.y + Math.sin(angle) * distance
        };
        
        // Check if valid (at least r away from all existing points)
        let valid = true;
        for (const p of points) {
          const dx = newPoint.x - p.x;
          const dy = newPoint.y - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < r) {
            valid = false;
            break;
          }
        }
        
        // If valid, add to our lists
        if (valid) {
          points.push(newPoint);
          activeList.push(points.length - 1);
          found = true;
          break;
        }
      }
      
      // If no valid point found, remove from active list
      if (!found) {
        activeList.splice(randomIndex, 1);
      }
      
      // Stop if we have enough points
      if (points.length >= n) {
        break;
      }
    }
    
    return points;
  }