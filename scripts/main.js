function isMobile() {
return (
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth <= 768 
);
}

function setupVideoFollow() {
    const selfGif = document.getElementById("self-gif");
    const video = document.getElementById("gif");
  
    if (!selfGif || !video) return;
  
    selfGif.addEventListener("mousemove", (e) => {
      video.style.left = `${e.clientX + 15}px`;
      video.style.top = `${e.clientY + 15}px`;
    });
  
    selfGif.addEventListener("mouseenter", () => {
      video.style.display = "block";
    });
  
    selfGif.addEventListener("mouseleave", () => {
      video.style.display = "none";
    });
  }

if (isMobile()) {
    const video = document.getElementById("gif");
    const blocker = document.getElementById("mobile-blocker");
    
    video.remove();
    blocker.classList.remove("hidden");
    blocker.classList.add("flex");
} else {
    setupVideoFollow();
}

const bracketItems = document.querySelectorAll('.bracket-item');

bracketItems.forEach(function(item) {
    item.addEventListener('click', function() {
        bracketItems.forEach(function(bracket) {
            bracket.classList.remove('underlined');
        });
        this.classList.add('underlined');
    });
});