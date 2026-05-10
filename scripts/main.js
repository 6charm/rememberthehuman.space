// Add debug logging at the top
console.log("Script loaded");
console.log("Is mobile:", ("ontouchstart" in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768);
console.log("Window width:", window.innerWidth);
console.log("Touch support:", "ontouchstart" in window);
console.log("Max touch points:", navigator.maxTouchPoints);

function isMobile() {
return (
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth <= 768
);
}

function setupMarginNotes() {
    const triggers = document.querySelectorAll('.annotated[data-note]');
    if (!triggers.length) return;

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const noteId = trigger.dataset.note;
            const note = document.getElementById(noteId);
            if (!note) return;

            const isVisible = note.classList.contains('is-visible');

            // Close all notes first
            document.querySelectorAll('.margin-note.is-visible').forEach(n => {
                n.classList.remove('is-visible');
                n.setAttribute('aria-hidden', 'true');
            });
            document.querySelectorAll('.annotated.is-active').forEach(t => {
                t.classList.remove('is-active');
            });

            if (!isVisible) {
                if (window.innerWidth > 768) {
                    // Desktop: align note with trigger inside the wrapper.
                    const wrapper = trigger.closest('.about-text-wrapper');
                    if (wrapper) {
                        const wrapperRect = wrapper.getBoundingClientRect();
                        const triggerRect = trigger.getBoundingClientRect();
                        note.style.top = (triggerRect.top - wrapperRect.top) + 'px';
                    }
                    note.style.maxHeight = '';
                } else {
                    // Mobile: position the note as a viewport-fixed card
                    // immediately below the tapped trigger so it stays
                    // visually anchored to what the user clicked.
                    const triggerRect = trigger.getBoundingClientRect();
                    const gap = 8;
                    const margin = 16;
                    note.style.top = (triggerRect.bottom + gap) + 'px';
                    note.style.maxHeight =
                        Math.max(120, window.innerHeight - triggerRect.bottom - gap - margin) + 'px';
                }
                note.classList.add('is-visible');
                note.setAttribute('aria-hidden', 'false');
                trigger.classList.add('is-active');
            }
        });
    });

    // Click outside closes notes. On mobile the note itself is also a
    // dismiss target (tap-anywhere); on desktop the note is interactive
    // (links, cite-imgs) so taps inside it don't close.
    document.addEventListener('click', (e) => {
        const insideTrigger = e.target.closest('.annotated');
        const insideNote = window.innerWidth > 768 && e.target.closest('.margin-note');
        if (!insideTrigger && !insideNote) {
            document.querySelectorAll('.margin-note.is-visible').forEach(n => {
                n.classList.remove('is-visible');
                n.setAttribute('aria-hidden', 'true');
            });
            document.querySelectorAll('.annotated.is-active').forEach(t => {
                t.classList.remove('is-active');
            });
        }
    });
}

function setupCiteImages() {
    const cites = document.querySelectorAll('.cite-img[data-img]');
    if (!cites.length) return;

    let openCite = null;

    cites.forEach(cite => {
        cite.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Always clear any existing overlay first.
            document.querySelectorAll('.cite-img-overlay').forEach(el => el.remove());

            if (openCite === cite) {
                openCite = null;
                return;
            }

            openCite = cite;
            const img = document.createElement('img');
            img.src = cite.dataset.img;
            img.className = 'cite-img-overlay';
            // On mobile, append to <body> so the overlay escapes the
            // margin-note's stacking context and renders above everything.
            // On desktop, keep the legacy anchor (negative offsets relative
            // to the inline cite span).
            const target = window.innerWidth <= 768 ? document.body : cite;
            target.appendChild(img);
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cite-img') && !e.target.closest('.cite-img-overlay')) {
            document.querySelectorAll('.cite-img-overlay').forEach(el => el.remove());
            openCite = null;
        }
    });
}

function setupSelfGifMobile() {
    const selfGif = document.getElementById("self-gif");
    if (!selfGif) return;

    selfGif.addEventListener("click", (e) => {
        e.stopPropagation();
        selfGif.classList.toggle("is-open");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest('#self-gif')) {
            selfGif.classList.remove("is-open");
        }
    });
}

function setupVideoFollow() {
    const selfGif = document.getElementById("self-gif");
    const video = document.getElementById("gif");

    if (!selfGif || !video) return;

    video.playbackRate = 0.75; // adjust: 1.0 = normal, 0.5 = half speed

    const style = getComputedStyle(video);
    const offsetX = parseFloat(style.getPropertyValue('--gif-offset-x')) || 15;
    const offsetY = parseFloat(style.getPropertyValue('--gif-offset-y')) || 15;

    selfGif.addEventListener("mousemove", (e) => {
      video.style.left = `${e.clientX + offsetX}px`;
      video.style.top = `${e.clientY + offsetY}px`;
    });

    selfGif.addEventListener("mouseenter", () => {
      video.style.display = "block";
    });

    selfGif.addEventListener("mouseleave", () => {
      video.style.display = "none";
    });
}

document.querySelectorAll('.rotating-logo').forEach(logo => {
  let angle = 0;
  let animationFrameId = null;

  function rotate() {
    angle = (angle + 1.6) % 360;
    logo.style.transform = `rotate(${angle}deg)`;
    animationFrameId = requestAnimationFrame(rotate);
  }

  logo.addEventListener('mouseenter', () => {
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(rotate);
    }
  });

  logo.addEventListener('mouseleave', () => {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  });
});

function makeCard(meta, authors, title, desc="", href = '#') {
  return `
     <div class="scroll-item">
       <a href="${href}">
         <div class="meta">${meta}</div>
         <div class="authors">${authors}</div>
         <div class="title">${title}</div>
       </a>
       <p>
       ${desc}
       </p>
     </div>
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, checking mobile again");

  // Handle mobile detection first. Pages that opt in via
  // `<body data-allow-mobile>` skip the blocker and get a tap-to-toggle
  // self-gif instead of the cursor-follow video.
  const allowMobile = document.body.dataset.allowMobile !== undefined;

  if (isMobile() && !allowMobile) {
    console.log("Mobile detected, showing blocker");
    const video = document.getElementById("gif");

    if (video) {
      video.remove();
      console.log("Video removed");
    }

    // Inject blocker if it doesn't already exist in the page
    let blocker = document.getElementById("mobile-blocker");
    if (!blocker) {
      blocker = document.createElement("div");
      blocker.id = "mobile-blocker";
      blocker.className = "m-blocker bg-white text-lg flex";
      blocker.innerHTML = `
        <div class="text-white text-center">
          <span class="text-5xl">Please</span><br>
          visit from a desktop computer
        </div>
        <div class="star-logo-mobile">
          <img src="/assets/armaan-logo.svg" width="64" height="64" alt="logo">
        </div>
      `;
      document.body.prepend(blocker);
    } else {
      blocker.classList.remove("hidden");
      blocker.classList.add("flex");
    }
  } else if (isMobile()) {
    console.log("Mobile detected, page opts in — setting up tap-to-toggle self-gif");
    setupSelfGifMobile();
  } else {
    console.log("Not mobile, setting up video follow");
    setupVideoFollow();
  }

  setupCiteImages();

  const projectData =[
    // {meta:"NEW", authors:"Armaan Chowfin and Narayan Rangaraj", title:"OPTIMIZED RAILWAY TIMETABLES", desc:"The Mumbai Local trains are experiencing a crisis: 20 deaths and grevious injuries every day.\n\nOver the next 10 years, the Mumbai Rail Vikas Corporation (MRVC) aims to phase out the non-AC rakes plying the Mumbai suburban railway network, and replace them with AC rakes with closing doors. To achieve this, the MRVC requires a data-driven approach to explore the rakes most suitable for replacement. The goal of this Github Project is to provide such a tool in the form of an extensible, GUI-based application.\nUsing a software representation of the railway timetable, the simulator generates an interactive rake-cycle visualization. Users can select any time period of interest and run analyses based on constraints derived from passenger preferences. One key analysis measures the “mixing” of AC and non-AC rakes at stations, quantified via cross-entropy. Until full AC transition, the objective is to maximize this value to maintain a balanced mix across the network. Finally, using a PESP formulation of the rail scheduling problem, we intend to generate optimal timetables dynamically given the various constraints."},
    // {meta:"NEW", authors:"Armaan Chowfin and Daniel Schurmann", title:"IMROVED DJ SCRATCHING IN MIXXX", desc:"Mixxx uses the SoundTouch and RubberBand time-stretching libraries for resampling during a keyLock operation. However, these libraries are unsuitable for scratching due to the fast changing tempo and pitch. Currently a faster, handcrafted linear interpolation algorithm is used - but there have been reports of suboptimal audio quality.Digital Signal Processing (DSP) theory tells us that linear interpolation is not ideal, and that a sinc-based resampler will always return interpolated values identical to the original analog signal, under certain theoretical constraints. However, practical implementations of sinc resampling are computationally heavy and generally unsuitable for low-latency realtime software such as Mixxx. Therefore...One objective of this GSoC project was to explore the feasibility of using sinc interpolation for scratching. To this end, the libsamplerate and libzita resample latencies were evaluated.Another focus was to investigate and improve the performance of the current linear resampler. Here, we observed that the libsamplerate linear interpolator outperformed our own, reducing per-buffer resample latency from 20µs to 10µs."}
  ]

  const notesData = [
    {
      title: "0-test",
      audio: "assets/audio/1intro.mp3",
      thumb: "octotat-red"
    },
    {
      title: "1-test",
      audio: "assets/audio/1.mp3",
      thumb: "octotat-black"
    },
  ];


  function makeAudioTile(title, audioUrl, thumb) {
    return `
      <div class="note-tile">
      <p>${title}</p>
        <div class="audio-wrapper">
          <img src="assets/${thumb}.svg" class="audio-thumb">
          <audio controls preload="none">
            <source src="${audioUrl}" type="audio/mp3">
          </audio>
        </div>
      </div>
    `;
  }

  function buildNotesGrid(items) {
    let html = `<div class="notes-grid">`;
    items.forEach(item => {
      html += makeAudioTile(item.title, item.audio, item.thumb);
    });
    html += `</div>`;
    return html;
  }

  function buildColumnSection(items) {
    let html = `<div class="column-wrapper">`;
    items.forEach(item => {
      html += makeCard(item.meta, item.authors, item.title,item.desc, item.href);
    });
    html += `</div>`;
    return html;
  }

  const sectionContents = {
    Projects: buildColumnSection(projectData),
    Notes: buildNotesGrid(notesData)
  };

  // // Content for each section
  // const sectionContents = {
  //   Projects: `<div class="bracket-content"><p></p></div>`,
  //   Notes: `<div class="bracket-content"><p></p></div>`
  // };

  function loadSection(page) {
    // Update active state
    document.querySelectorAll('.bracket-item').forEach(i => {
      i.classList.toggle('underlined', i.dataset.page === page);
    });

    // Insert/replace dynamic content
    const container = document.getElementById('dynamic-content');
    container.innerHTML = sectionContents[page] || '';
  }

  // Handle bracket navigation
  document.querySelectorAll('.bracket-item[data-page]').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      loadSection(this.dataset.page);
    });
  });

  // Handle other nav items
  document.querySelectorAll('.nav-item:not([data-page])').forEach(item => {
    item.addEventListener('click', function() {
      document.getElementById('dynamic-content').innerHTML = '';
      document.querySelectorAll('.bracket-item').forEach(i => {
        i.classList.remove('underlined');
      });
    });
  });

  // --- Margin Notes ---
  setupMarginNotes();

  // Load 'Notes' section by default on initial page load
  const defaultSection = 'Notes';
  loadSection(defaultSection);

  // Find and highlight the 'Notes' button in navbar
  const allButton = document.querySelector('.bracket-item[data-page="Notes"]');
  if (allButton) {
    allButton.classList.add('underlined');
  }

  // Handle bracket item clicks (your original bracket functionality)
  const bracketItems = document.querySelectorAll('.bracket-item');
  bracketItems.forEach(function(item) {
      item.addEventListener('click', function() {
          bracketItems.forEach(function(bracket) {
              bracket.classList.remove('underlined');
          });
          this.classList.add('underlined');
      });
  });
});
