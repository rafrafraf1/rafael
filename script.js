
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