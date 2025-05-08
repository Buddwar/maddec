  // Function to adjust iframe content scaling
  function adjustIframeScaling() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        const container = iframe.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Set iframe content scaling to fit container
        iframe.style.transform = `scale(${containerWidth / iframe.offsetWidth})`;
        iframe.style.width = `${100 * (iframe.offsetWidth / containerWidth)}%`;
        iframe.style.height = `${100 * (iframe.offsetHeight / containerHeight)}%`;
    });
}

// Adjust scaling on load and resize
window.addEventListener('load', adjustIframeScaling);
window.addEventListener('resize', adjustIframeScaling);