if ("ontouchstart"in window) {
    const o = document.getElementById("mobile-blocker");
    o.classList.remove("hidden"),
    o.classList.add("flex")
}