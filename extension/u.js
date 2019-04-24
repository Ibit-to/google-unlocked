$(function () {
    if (window.location.href.indexOf('//www.google') === -1) {
        return
    }
    var s = $('#search div.g').last()

    $('div i > a').each(function (i, a) {
        if (a.href.toLowerCase().indexOf('chillingeffects') === -1) {
            return
        }
        var id = a.href.replace(/https?:\/\/www\.chillingeffects\.org\/notice.cgi\?sID=/, '')
        var url = 'https://www.lumendatabase.org/notices/' + id
        setTimeout(function () {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'html',
                success: function (data) {
                    var links = data.match(/>(https?:\/\/[^<]+)<\/li>/g)
                    for (var i in links) {
                        u = links[i].replace('</li>', '').replace('>', '')
                        s.after('<div class="g">'
                            + '<a href="' + u + '" target="_blank">' + u + '</a>'
                            + '</div>'
                        )
                    }
                },
                error: function (e, err) {
                    console.log(e, err);
                },
                xhr: function () {
                    var xhr = jQuery.ajaxSettings.xhr();
                    var setRequestHeader = xhr.setRequestHeader;
                    xhr.setRequestHeader = function (name, value) {
                        if (name == 'X-Requested-With') return;
                        setRequestHeader.call(this, name, value);
                    }
                    return xhr;
                },

            });
        }, i * 2000);
    })


});
