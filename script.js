document.getElementById('loadBtn').addEventListener('click', function () {
  // Show bio content and hide the load button
  const bioContent = document.querySelector('.bio-content');
  bioContent.style.display = 'block';
  bioContent.style.zIndex = 2; // ensure its above the background
  document.getElementById('loadBtn').style.display = 'none';

  // play background music
  const audio = new Audio('https://raw.githubusercontent.com/A1hame/Website/main/assets/1199074012119175309/Audios/Aiham.mp3');
  audio.volume = 0.1; // 15% volume - put to 20% (.2) maybe, its kinda loud on 100% pc volume but its fine for avrg mobile volume - if you put 30% or above ur gonna commit at least 30 war crimes so be warned
  audio.loop = false;
  audio.play();

  // typewriter effect
  const quote = document.getElementById('quote');
  const text = 'The Sun Will Rise And We Will Try Again';
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      quote.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 100);
    } else {
      // once typing is done wrap it in an anchor tag (otherwise u cant click the link idk why dont ask me)
      quote.innerHTML = <a href="https://www.adl.org/" target="_blank">${text}</a>;
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
  hideTimeout = setTimeout(hideEmbed, 15000); // hide after 15 sec of inactivity
}

// add event listeners to reset the timeout on hover
embed.addEventListener('mouseenter', () => {
  showEmbed();
});

embed.addEventListener('mouseleave', () => {
  resetHideTimeout();
});

// Test 
console.log("I Hacked You");

// detect mouse movement and show embed again if its invisible
document.addEventListener('mousemove', () => {
  if (embed.classList.contains('invisible')) {
    showEmbed();
  }
});

// start the hide timeout
resetHideTimeout();
