document.getElementById('loadBtn').addEventListener('click', function () {
  // Show bio content and hide the load button
  const bioContent = document.querySelector('.bio-content');
  bioContent.style.display = 'block';
  bioContent.style.zIndex = 2; // ensure its above the background
  document.getElementById('loadBtn').style.display = 'none';

  // play background music
  const audio = new Audio('https://storage.eclipsed.top/1171914012691005440/aiham/video.mp3');
  audio.volume = 0.15; // 15% volume - put to 20% (.2) maybe, its kinda loud on 100% pc volume but its fine for avrg mobile volume - if you put 30% or above ur gonna commit at least 30 war crimes so be warned
  audio.loop = false;
  audio.play();

  // discord link typewriter effect
  const discordLink = document.getElementById('discord-link');
  const text = 'https://discord.gg/eclipsedtop';
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      discordLink.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 100);
    } else {
      // once typing is done wrap it in an anchor tag (otherwise u cant click the link idk why dont ask me)
      discordLink.innerHTML = `<a href="https://discord.gg/eclipsedtop" target="_blank">${text}</a>`;
    }
  }

  setTimeout(typeWriter, 1000); // starts after 1 sec
});

// embed element
const embed = document.querySelector('.embed');

// timer variable to track inactivity
let hideTimeout;

// show the embed
function showEmbed() {
  embed.classList.remove('invisible');
  resetHideTimeout();
}

// hide the embed
function hideEmbed() {
  embed.classList.add('invisible');
}

// reset the timeout when embed is shown
function resetHideTimeout() {
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(hideEmbed, 5000); // hide after 5 sec of inactivity
}

// add event listeners to reset the timeout on hover
embed.addEventListener('mouseenter', () => {
  showEmbed();
});

embed.addEventListener('mouseleave', () => {
  resetHideTimeout();
});

// error handleing
console.log("script.js has loaded successfully!");

// detect mouse movement and show embed again if its invisible
document.addEventListener('mousemove', () => {
  if (embed.classList.contains('invisible')) {
    showEmbed();
  }
});

// start the hide timeout
resetHideTimeout();
