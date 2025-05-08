document.addEventListener('DOMContentLoaded', function() {
    // Initialize gauges
    initGauge('voltage', -10, 10, 1, 'V');
    initGauge('current', -100, 100, 10, 'A');
    initGauge('power', -200, 200, 20, 'W');
  
    // Initialize status parameters with default values
    updateStatusParameters({
      voltage: 4.91,
      current: -10.69,
      power: -52.49,
      soc: 0,
      range: 0.0,
      status: "Not Charging",
      soh: "Poor",
      fullcharge: "Not Full",
      humidity: "NAN",
      temp: "NAN",
      alert: "A LOW BATTERY!"
    });
  
    // Form submission handler
    document.getElementById('updateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const voltage = parseFloat(this.elements.voltage.value) || 0;
      const current = parseFloat(this.elements.current.value) || 0;
      const power = parseFloat(this.elements.power.value) || 0;
      
      updateGauge('voltage', voltage);
      updateGauge('current', current);
      updateGauge('power', power);
    });
  });
  
  function initGauge(type, min, max, step, unit) {
    const gauge = document.querySelector(`.ticks[data-type="${type}"]`);
    const labelsContainer = document.querySelector(`.gauge-labels[data-type="${type}"]`);
    
    // Clear any existing ticks and labels
    gauge.innerHTML = '';
    labelsContainer.innerHTML = '';
    
    // Create ticks and labels
    const range = max - min;
    const tickCount = range / step;
    const angleStep = 180 / tickCount;
    
    for (let i = 0; i <= tickCount; i++) {
      const value = min + (i * step);
      const angle = -90 + (i * angleStep);
      
      // Create tick mark
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      gauge.appendChild(tick);
      
      // Create label for every 2nd tick or for min/max
      if (i % 2 === 0 || i === 0 || i === tickCount) {
        const label = document.createElement('div');
        label.className = 'tick-label';
        label.textContent = value;
        
        const radius = 70;
        const angleRad = (angle - 90) * Math.PI / 180;
        const x = 100 + radius * Math.cos(angleRad);
        const y = 100 + radius * Math.sin(angleRad);
        
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.style.transform = `translate(-50%, -50%)`;
        
        labelsContainer.appendChild(label);
      }
    }
  }
  
  function updateGauge(type, value) {
    const needle = document.getElementById(`needle-${type}`);
    const valueDisplay = document.getElementById(`value-${type}`);
    
    let min, max, unit;
    
    switch(type) {
      case 'voltage':
        min = -10;
        max = 10;
        unit = 'V';
        break;
      case 'current':
        min = -100;
        max = 100;
        unit = 'A';
        break;
      case 'power':
        min = -200;
        max = 200;
        unit = 'W';
        break;
    }
    
    // Clamp value between min and max
    value = Math.max(min, Math.min(max, value));
    
    // Calculate rotation angle (-90 to 90 degrees)
    const rotation = ((value - min) / (max - min)) * 180 - 90;
    
    // Update needle position
    needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    // Update value display
    valueDisplay.textContent = `${value.toFixed(2)} ${unit}`;
    
    // Update form field
    document.querySelector(`input[name="${type}"]`).value = value;
  }
  
  function updateStatusParameters(params) {
    // Update gauges
    updateGauge('voltage', params.voltage);
    updateGauge('current', params.current);
    updateGauge('power', params.power);
    
    // Update status parameters
    document.getElementById('value-soc').textContent = `${params.soc}%`;
    document.getElementById('value-range').textContent = `${params.range.toFixed(1)} km`;
    document.getElementById('value-status').textContent = params.status;
    document.getElementById('value-soh').textContent = params.soh;
    document.getElementById('value-fullcharge').textContent = params.fullcharge;
    
    // Handle NAN values
    const humidityValue = isNaN(params.humidity) ? "NAN" : params.humidity;
    document.getElementById('value-humidity').textContent = `${humidityValue}%`;
    
    const tempValue = isNaN(params.temp) ? "NAN°C - Normal" : `${params.temp}°C - ${params.temp > 40 ? 'High' : 'Normal'} Temp`;
    document.getElementById('value-temp').textContent = tempValue;
    
    document.getElementById('value-alert').textContent = params.alert;
  }document.addEventListener('DOMContentLoaded', function() {
    // Initialize gauges
    initGauge('voltage', -10, 10, 1, 'V');
    initGauge('current', -100, 100, 10, 'A');
    initGauge('power', -200, 200, 20, 'W');
  
    // Initialize status parameters with default values
    updateStatusParameters({
      voltage: 4.91,
      current: -10.69,
      power: -52.49,
      soc: 0,
      range: 0.0,
      status: "Not Charging",
      soh: "Poor",
      fullcharge: "Not Full",
      humidity: "NAN",
      temp: "NAN",
      alert: "A LOW BATTERY!"
    });
  
    // Form submission handler
    document.getElementById('updateForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const voltage = parseFloat(this.elements.voltage.value) || 0;
      const current = parseFloat(this.elements.current.value) || 0;
      const power = parseFloat(this.elements.power.value) || 0;
      
      updateGauge('voltage', voltage);
      updateGauge('current', current);
      updateGauge('power', power);
    });
  });
  
  function initGauge(type, min, max, step, unit) {
    const gauge = document.querySelector(`.ticks[data-type="${type}"]`);
    const labelsContainer = document.querySelector(`.gauge-labels[data-type="${type}"]`);
    
    // Clear any existing ticks and labels
    gauge.innerHTML = '';
    labelsContainer.innerHTML = '';
    
    // Create ticks and labels
    const range = max - min;
    const tickCount = range / step;
    const angleStep = 180 / tickCount;
    
    for (let i = 0; i <= tickCount; i++) {
      const value = min + (i * step);
      const angle = -90 + (i * angleStep);
      
      // Create tick mark
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      gauge.appendChild(tick);
      
      // Create label for every 2nd tick or for min/max
      if (i % 2 === 0 || i === 0 || i === tickCount) {
        const label = document.createElement('div');
        label.className = 'tick-label';
        label.textContent = value;
        
        const radius = 70;
        const angleRad = (angle - 90) * Math.PI / 180;
        const x = 100 + radius * Math.cos(angleRad);
        const y = 100 + radius * Math.sin(angleRad);
        
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.style.transform = `translate(-50%, -50%)`;
        
        labelsContainer.appendChild(label);
      }
    }
  }
  
  function updateGauge(type, value) {
    const needle = document.getElementById(`needle-${type}`);
    const valueDisplay = document.getElementById(`value-${type}`);
    
    let min, max, unit;
    
    switch(type) {
      case 'voltage':
        min = -10;
        max = 10;
        unit = 'V';
        break;
      case 'current':
        min = -100;
        max = 100;
        unit = 'A';
        break;
      case 'power':
        min = -200;
        max = 200;
        unit = 'W';
        break;
    }
    
    // Clamp value between min and max
    value = Math.max(min, Math.min(max, value));
    
    // Calculate rotation angle (-90 to 90 degrees)
    const rotation = ((value - min) / (max - min)) * 180 - 90;
    
    // Update needle position
    needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    // Update value display
    valueDisplay.textContent = `${value.toFixed(2)} ${unit}`;
    
    // Update form field
    document.querySelector(`input[name="${type}"]`).value = value;
  }
  
  function updateStatusParameters(params) {
    // Update gauges
    updateGauge('voltage', params.voltage);
    updateGauge('current', params.current);
    updateGauge('power', params.power);
    
    // Update status parameters
    document.getElementById('value-soc').textContent = `${params.soc}%`;
    document.getElementById('value-range').textContent = `${params.range.toFixed(1)} km`;
    document.getElementById('value-status').textContent = params.status;
    document.getElementById('value-soh').textContent = params.soh;
    document.getElementById('value-fullcharge').textContent = params.fullcharge;
    
    // Handle NAN values
    const humidityValue = isNaN(params.humidity) ? "NAN" : params.humidity;
    document.getElementById('value-humidity').textContent = `${humidityValue}%`;
    
    const tempValue = isNaN(params.temp) ? "NAN°C - Normal" : `${params.temp}°C - ${params.temp > 40 ? 'High' : 'Normal'} Temp`;
    document.getElementById('value-temp').textContent = tempValue;
    
    document.getElementById('value-alert').textContent = params.alert;
  }