$(function () {
    if (window.location.href.indexOf('//www.google') === -1) {
        return
    }
    s = $('#search div.g').last()
    
    var escapeHTML = function(str) {
        return String(str).replace(/[&"'<>]/g, function(match) {
            return escapeHTML.replacements[match];
        });
    }
    escapeHTML.replacements = {"&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;"};

    $('div i > a').each(function (i, a) {
        if (a.href.toLowerCase().indexOf('chillingeffects') === -1) {
            return
        }
        id = a.href.replace(/https?:\/\/www\.chillingeffects\.org\/notice.cgi\?sID=/, '')
        url = 'https://www.lumendatabase.org/notices/' + id
        if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
            url = 'https://cors-anywhere.herokuapp.com/' + url
        }
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'html',
            success: function (data) {
                links = data.match(/>(https?:\/\/[^<]+)<\/li>/g)
                for (i in links) {
                    var u = escapeHTML(links[i].replace('</li>', '').replace('>', ''))
                    s.after('<div class="g">'
                        + '<a href="' + u + '" target="_blank">' + u + '</a>'
                        + '</div>'
                    )
                }
            },
            error: function (e, err) {
                console.log(err);
            }
        });
    })


});
