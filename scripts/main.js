function isMobile() {
return (
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth <= 768  // Adjust breakpoint as needed
);
}

if (isMobile()) {
    const video = document.getElementById("gif");
    const blocker = document.getElementById("mobile-blocker");
    
    video.remove();
    blocker.classList.remove("hidden");
    blocker.classList.add("flex");
  }