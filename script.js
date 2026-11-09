// This script creates the typed headline effect in the landing section.
(function () {
  var title = document.getElementById("title");
  var lines = Array.prototype.slice.call(title.querySelectorAll("span"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Skip the typing animation when the user prefers reduced motion.
  if (!reduce) {
    var texts = lines.map(function (line) {
      return line.textContent;
    });

    lines.forEach(function (line) {
      line.textContent = "";
    });

    var lineIndex = 0;
    var charIndex = 0;

    function type() {
      lines.forEach(function (line) {
        line.classList.remove("caret");
      });

      var currentLine = lines[lineIndex];
      currentLine.classList.add("caret");
      currentLine.textContent = texts[lineIndex].slice(0, ++charIndex);

      if (charIndex < texts[lineIndex].length) {
        setTimeout(type, 85);
      } else if (lineIndex < lines.length - 1) {
        lineIndex += 1;
        charIndex = 0;
        setTimeout(type, 350);
      } else {
        setTimeout(function () {
          currentLine.classList.remove("caret");
        }, 3000);
      }
    }

    setTimeout(type, 400);
  }

  function scrollToTop() {
    if (window.scrollY > 40) {
      window.scrollTo({
        top: 0,
        behavior: reduce ? "auto" : "smooth"
      });
    }
  }

  // This code makes the back-to-top link scroll smoothly without changing the URL hash.
  document.getElementById("toTop").addEventListener("click", function (event) {
    event.preventDefault();
    scrollToTop();
  });

  // Filter poems and their index links by title or matching poem text.
  var searchForm = document.querySelector(".poem-search");
  var searchInput = document.getElementById("poem-search");
  var searchStatus = document.querySelector(".search-status");
  var poemSections = document.querySelectorAll(".poem");

  if (searchForm && searchInput && searchStatus) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
    });

    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLocaleLowerCase();
      var visibleCount = 0;

      poemSections.forEach(function (poem) {
        var matches = poem.textContent.toLocaleLowerCase().includes(query);
        poem.hidden = !matches;
        visibleCount += matches ? 1 : 0;

        var indexLink = document.querySelector('a[href="#' + poem.id + '"]');
        if (indexLink) {
          indexLink.closest("li").hidden = !matches;
        }
      });

      searchStatus.textContent = query
        ? visibleCount + (visibleCount === 1 ? " poem found" : " poems found")
        : "";
    });
  }

  // Reveal each poem when it enters the viewport so the page feels more cinematic.
  if ("IntersectionObserver" in window) {
    var poemObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          poemObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });

    poemSections.forEach(function (poem) {
      poemObserver.observe(poem);
    });
  } else {
    poemSections.forEach(function (poem) {
      poem.classList.add("visible");
    });
  }

})();
