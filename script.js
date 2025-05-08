document.addEventListener('DOMContentLoaded', function() {
  // Initialize gauges
  initGauge('voltage', -10, 10, 1, 'V');
  initGauge('current', -100, 100, 10, 'A');
  initGauge('power', -200, 200, 20, 'W');

  // Initialize with default values (will be updated by Arduino data)
  updateStatusParameters({
      voltage: 0,
      current: 0,
      power: 0,
      chargeLevel: 0,
      range: 0.0,
      status: "Not Charging",
      soh: "Poor",
      fullcharge: "Not Full",
      humidity: "NAN",
      temp: "NAN",
      alert: "Waiting for data..."
  });

  // Connect to serial port
  connectSerial();
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
}

function updateStatusParameters(params) {
  // Update gauges
  updateGauge('voltage', params.voltage);
  updateGauge('current', params.current);
  updateGauge('power', params.power);
  
  // Update status parameters
  document.getElementById('value-soc').textContent = `${params.chargeLevel || 0}%`;
  document.getElementById('value-range').textContent = `${params.range.toFixed(1)} km`;
  document.getElementById('value-status').textContent = params.status || "Not Charging";
  document.getElementById('value-soh').textContent = params.soh || "Poor";
  document.getElementById('value-fullcharge').textContent = params.fullcharge || "Not Full";
  
  // Handle NAN values
  const humidityValue = params.humidity === "NAN" ? "NAN" : params.humidity;
  document.getElementById('value-humidity').textContent = `${humidityValue}%`;
  
  const tempValue = params.temp === "NAN" ? "NAN°C - Normal" : `${params.temp}°C - ${params.temp > 40 ? 'High' : 'Normal'} Temp`;
  document.getElementById('value-temp').textContent = tempValue;
  
  document.getElementById('value-alert').textContent = params.alert || "A LOW BATTERY!";
}

async function connectSerial() {
  try {
      // Check if the browser supports the Web Serial API
      if (!('serial' in navigator)) {
          updateConnectionStatus(false, "Web Serial API not supported in this browser.");
          return;
      }

      // Request serial port access
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      updateConnectionStatus(true, "Connected to Arduino");

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      // Read data from serial port
      while (true) {
          const { value, done } = await reader.read();
          if (done) {
              reader.releaseLock();
              break;
          }

          // Process the received data
          try {
              const data = JSON.parse(value.trim());
              updateStatusParameters(data);
          } catch (e) {
              console.error("Error parsing JSON:", e);
          }
      }
  } catch (error) {
      updateConnectionStatus(false, `Error: ${error.message}`);
  }
}

function updateConnectionStatus(connected, message) {
  const statusElement = document.getElementById('connection-status');
  statusElement.textContent = message;
  
  if (connected) {
      statusElement.classList.add('connected');
      statusElement.classList.remove('alert-danger');
  } else {
      statusElement.classList.remove('connected');
      statusElement.classList.add('alert-danger');
  }
}