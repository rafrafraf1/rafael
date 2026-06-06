
$(document).ready(function() {
    // card expand/shrink func
    $('body').on("click", function(e) {
        const target = $(e.target);
        if (target.hasClass("card") ||  target.parents(".card").length === 1) {
            const el = ( target.hasClass("card") ?  target :  target.parents(".card"));
            if (e.target.nodeName === "A") { // if a tag clicked then dont expand
                return;
            }
            if (el.hasClass("expanded")) {
                el.removeClass("expanded");
            }
            else {
                el.addClass("expanded");
            }
        }
        else {
            if ($(".expanded").length === 1) {
                $(".expanded").removeClass("expanded");
            }       
        }
    });

    $('a[href=\'#contact\']').on("click", () => {
        $(".show").removeClass("show");
    })
});

// load img on scroll if in view
$(window).scroll(function() {
    // will find unloaded gifs and load and show them, while hiding the preview img
    $.each($('.lazy'), function() {
        const top = $(this).parent().find("img:not(.lazy)").offset().top; // cant use unloaded image offset because its display none, so use the offset of the placeholder image
        
        if ( $(this).attr('data-src') && top < ($(window).scrollTop() + $(window).height() + 100) ) {
            var source = $(this).data('src');

            if ($(this).hasClass("lazy")) {
                $(this).one("load", function() {
                    $(this).parent().removeClass("unloaded");
                })
                .attr("src", source)
                .removeAttr('data-src')
                .each(function() {
                    //Cache fix for browsers that don't trigger .load()
                    if (this.complete) {
                        $(this).trigger('load');
                    }
                });
            }
        }
    })   
})

// download cv funcs
function download(url, filename) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
  })
  .catch(console.error);
}
function download_cv() {
    download("../Rafael_Asmoucha_resume.pdf","Rafael_Asmoucha_resume.pdf");
    document.getElementById('cv-btn').style.display = 'none';
}


window.addEventListener("load", function() {
    const tagline = document.getElementById("tagline");
    if (!tagline) {
        return;
    }

    const taglines = [
        tagline.textContent,
        "Computer Science student.",
        "Web Developer.",
        "Software Engineer.",
        "Math Tutor.",
        "CS Tutor."
    ];
    let index = 0;

    tagline.style.transition = "opacity 250ms ease";
    tagline.style.opacity = "1";

    setInterval(function() {
        index = (index + 1) % taglines.length;
        tagline.style.opacity = "0";

        setTimeout(function() {
            tagline.textContent = taglines[index];
            tagline.style.opacity = "1";
        }, 250);
    }, 3000);
});

window.addEventListener("load", function() {
    const carousel = document.getElementById("art-carousel");
    if (!carousel) {
        return;
    }

    const stage = carousel.querySelector(".art-carousel-stage");
    const dotsContainer = carousel.querySelector(".art-carousel-dots");
    const prevButton = carousel.querySelector(".art-carousel-prev");
    const nextButton = carousel.querySelector(".art-carousel-next");
    const drawings = [
        "image0.jpeg",
        "image1.jpeg",
        "image2.jpeg",
        "image3.jpeg",
        "image4.jpeg",
        "image5.jpeg",
        "image6.jpeg",
        "image7.jpeg",
        "image8.jpeg",
        "image9.jpeg",
        "image10.jpeg",
        "image11.jpeg",
        "image12.jpeg",
        "image13.jpeg",
        "image14.jpeg",
        "image15.jpeg",
        "image16.jpeg"
    ];

    for (let index = drawings.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentDrawing = drawings[index];

        drawings[index] = drawings[randomIndex];
        drawings[randomIndex] = currentDrawing;
    }

    let currentIndex = 0;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isSwiping = false;
    let autoplayTimer = 0;

    drawings.forEach(function(filename, index) {
        const item = document.createElement("figure");
        const image = document.createElement("img");

        item.className = "art-carousel-item";
        image.src = "./images/drawings/" + filename;
        image.alt = "Rafi digital artwork " + (index + 1);
        image.loading = index < 3 ? "eager" : "lazy";
        image.decoding = "async";

        item.appendChild(image);
        stage.appendChild(item);
    });

    const items = Array.from(stage.querySelectorAll(".art-carousel-item"));

    drawings.forEach(function(_, index) {
        const dot = document.createElement("button");

        dot.className = "art-carousel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", "Show artwork " + (index + 1));

        dot.addEventListener("click", function() {
            stopAutoplay();
            currentIndex = index;
            renderCarousel();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".art-carousel-dot"));

    function wrapIndex(index) {
        return (index + items.length) % items.length;
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = 0;
        }
    }

    function renderCarousel() {
        const leftIndex = wrapIndex(currentIndex - 1);
        const rightIndex = wrapIndex(currentIndex + 1);

        items.forEach(function(item, index) {
            item.className = "art-carousel-item";

            if (index === currentIndex) {
                item.classList.add("is-center");
            }
            else if (index === leftIndex) {
                item.classList.add("is-left");
            }
            else if (index === rightIndex) {
                item.classList.add("is-right");
            }
        });

        dots.forEach(function(dot, index) {
            const isActive = index === currentIndex;

            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    function moveCarousel(direction) {
        currentIndex = wrapIndex(currentIndex + direction);
        renderCarousel();
    }

    prevButton.addEventListener("click", function() {
        stopAutoplay();
        moveCarousel(-1);
    });

    nextButton.addEventListener("click", function() {
        stopAutoplay();
        moveCarousel(1);
    });

    carousel.addEventListener("pointerdown", function(event) {
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        isSwiping = true;
    });

    carousel.addEventListener("pointerup", function(event) {
        if (!isSwiping) {
            return;
        }

        const deltaX = event.clientX - pointerStartX;
        const deltaY = event.clientY - pointerStartY;

        isSwiping = false;

        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
            stopAutoplay();
            moveCarousel(deltaX > 0 ? -1 : 1);
        }
    });

    carousel.addEventListener("pointercancel", function() {
        isSwiping = false;
    });

    renderCarousel();
    autoplayTimer = window.setInterval(function() {
        moveCarousel(1);
    }, 3500);
});
