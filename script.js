async function displayVisitorInfo() {
  const visitorInfoElement = document.getElementById('visitor-info');
  
  try {
    // Get the IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIp = ipData.ip;

    // Get the location data
    const geoResponse = await fetch(`https://ipapi.co/${userIp}/json/`);
    const geoData = await geoResponse.json();

    // Update the visitor info
    visitorInfoElement.textContent = `Last Visitor: ${geoData.country_name}`;
  } catch (error) {
    console.error('Error fetching visitor info:', error);
    visitorInfoElement.textContent = 'Unable to load visitor information';
  }
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', displayVisitorInfo);
