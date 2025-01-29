document.addEventListener('DOMContentLoaded', () => {
    const nameContainer = document.querySelector('.name-container');
    const audio = document.getElementById('backgroundAudio');
    const muteButton = document.getElementById('muteButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const card = document.querySelector('.card');
    const clickToStart = document.querySelector('.click-to-start');
    const cardContent = document.getElementById('card-content');
    let audioInitialized = false;
    let audioContext, analyser, dataArray;
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;
    let lastBassValue = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    volumeSlider.value = 10;
    const maxVolume = 0.2;

    function initCard() {
        clickToStart.style.display = 'none';
        cardContent.classList.remove('hidden');
        cardContent.classList.add('fade-in');
        initAudio();
        sequentialAnimations();
    }

    clickToStart.addEventListener('click', initCard);

    function initAudio() {
        if (!audioInitialized) {
            audio.currentTime = 66;
            audio.volume = 0;
            audioInitialized = true;
            setupAudioAnalyser();

            let fadeInDuration = 3000;
            let fadeStart = Date.now();
            let initialVolume = 0;
            let targetVolume = (volumeSlider.value / 100) * maxVolume;

            function fadeIn() {
                let elapsed = Date.now() - fadeStart;
                if (elapsed < fadeInDuration) {
                    audio.volume = initialVolume + (elapsed / fadeInDuration) * targetVolume;
                    requestAnimationFrame(fadeIn);
                } else {
                    audio.volume = targetVolume;
                }
            }

            audio.play().then(() => {
                fadeIn();
                console.log("Audio started playing");
            }).catch(error => {
                console.error("Error playing audio:", error);
            });
        }
    }

    function setupAudioAnalyser() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        console.log("Audio analyser set up");
    }

    function toggleMute() {
        if (!audioInitialized) {
            initAudio();
        } else {
            audio.paused ? audio.play() : audio.pause();
        }
        updateMuteButtonIcon();
    }

    function handleVolumeChange() {
        if (!audioInitialized) {
            initAudio();
        }
        audio.volume = (volumeSlider.value / 100) * maxVolume;
        updateMuteButtonIcon();
    }

    function updateMuteButtonIcon() {
        const isMuted = audio.paused || audio.volume === 0;
        muteButton.innerHTML = isMuted
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.452.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    }

    muteButton.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', handleVolumeChange);

    function lerp(start, end, factor) {
        return start * (1 - factor) + end * factor;
    }

    function updateAudioEffects() {
        const bounds = card.getBoundingClientRect();
        const mouseXRatio = (lastMouseX - bounds.left) / bounds.width - 0.5;
        const mouseYRatio = (lastMouseY - bounds.top) / bounds.height - 0.5;

        targetRotateX = Math.max(-10, Math.min(10, -mouseYRatio * 20));
        targetRotateY = Math.max(-10, Math.min(10, mouseXRatio * 20));

        currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
        currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

        let targetBassValue = 0;
        let punchScale = 1;
        let glowIntensity = 0;

        if (audioInitialized && !audio.paused) {
            analyser.getByteFrequencyData(dataArray);
            const bassRange = dataArray.slice(0, 3);
            const bassAvg = bassRange.reduce((a, b) => a + b) / bassRange.length / 255;
            targetBassValue = Math.pow(bassAvg, 2);
        }

        lastBassValue = lerp(lastBassValue, targetBassValue, 0.3);
        punchScale = 1 + lastBassValue * 0.2;
        glowIntensity = Math.pow(lastBassValue, 1.2);

        card.style.transform = `
            perspective(1000px)
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY}deg)
            scale(${punchScale})
        `;

        const primaryGlow = `rgba(102, 102, 255, ${0.3 + glowIntensity * 0.9})`;
        const secondaryGlow = `rgba(255, 102, 255, ${0.2 + glowIntensity * 0.7})`;

        card.style.boxShadow = `
            0 0 ${20 + glowIntensity * 40}px ${primaryGlow},
            0 0 ${10 + glowIntensity * 30}px ${secondaryGlow}
        `;

        updateParallaxElements(mouseXRatio, mouseYRatio);

        const mistySmoke = document.querySelector('.misty-smoke');
        mistySmoke.style.opacity = 0.1 + lastBassValue * 0.6;

        requestAnimationFrame(updateAudioEffects);
    }

    function updateParallaxElements(mouseXRatio, mouseYRatio) {
        const parallaxX = mouseXRatio * 10;
        const parallaxY = mouseYRatio * 10;

        const avatar = document.querySelector('.avatar');
        const fullName = document.querySelector('.full-name');
        const shortName = document.querySelector('.short-name');

        avatar.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
        fullName.style.transform = `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`;
        shortName.style.transform = `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`;
    }

    document.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    let devToolsOpen = false;

    function closeDevToolsPopup() {
        document.getElementById('devToolsPopup').style.display = 'none';
        devToolsOpen = false;
    }

    function showDevToolsPopup() {
        if (!devToolsOpen) {
            devToolsOpen = true;
            document.getElementById('devToolsPopup').style.display = 'flex';
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'F12') {
            showDevToolsPopup();
            event.preventDefault();
        }
    });

    document.addEventListener('contextmenu', (event) => {
        showDevToolsPopup();
        event.preventDefault();
    });

    function detectDevTools() {
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                showDevToolsPopup();
            }
        });
        console.log(element);
    }

    setInterval(detectDevTools, 1000);

    document.querySelector('#devToolsPopup .btn-primary').addEventListener('click', closeDevToolsPopup);

    updateAudioEffects();

    function typeDiscordUsername() {
        const discordUsername = document.getElementById('discord-username');
        discordUsername.textContent = '';
        const discordText = 'Discord: smnyk';
        let discordIndex = 0;

        function typeChar() {
            if (discordIndex < discordText.length) {
                discordUsername.textContent += discordText.charAt(discordIndex);
                discordIndex++;
                setTimeout(typeChar, 100);
            }
        }

        typeChar();
    }

    function sequentialAnimations() {
        setTimeout(() => {
            nameContainer.classList.add('animated');
            setTimeout(() => {
                startCelestiaAnimation();
                setTimeout(typeDiscordUsername, 3000);
            }, 2000);
        }, 500);
    }

    function startCelestiaAnimation() {
        const celestiaText = document.getElementById('celestiaText');
        celestiaText.style.opacity = '1';
        typeText('>Celestt', () => {
            setTimeout(() => {
                backspace(3, () => {
                    typeText('stia.mp3', () => {
                        celestiaText.innerHTML += '<span class="blinking-cursor"></span>';
                    });
                });
            }, 500);
        });
    }

    function typeText(text, callback) {
        const celestiaText = document.getElementById('celestiaText');
        let i = 0;
        function type() {
            if (i < text.length) {
                celestiaText.textContent += text.charAt(i);
                i++;
                setTimeout(type, Math.random() * 100 + 50);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

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

    function backspace(count, callback) {
        const celestiaText = document.getElementById('celestiaText');
        function erase() {
            if (count > 0) {
                celestiaText.textContent = celestiaText.textContent.slice(0, -1);
                count--;
                setTimeout(erase, Math.random() * 50 + 25);
            } else if (callback) {
                callback();
            }
        }
        erase();
    }
});
