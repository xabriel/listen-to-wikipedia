onconnect = (e) => {
  const port = e.ports[0];
  const url = 'https://stream.wikimedia.org/v2/stream/recentchange';
  const eventSource = new EventSource(url);
  let toFilter = new Set();

  port.start();
  console.log("worker started")
  
  eventSource.onopen = () => {
    console.info('Opened connection.');
  };
  eventSource.onerror = (event) => {
    console.error('Encountered error', event);
  };
  eventSource.onmessage = (event) => {
    // event.data will be a JSON message
    const data = JSON.parse(event.data);
    if (toFilter.has(data.server_name)) {
      port.postMessage(data);
    }
  };

  port.onmessage = (e) => {
    toFilter = e.data;
  }
}