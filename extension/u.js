$(function () {
    if (window.location.href.indexOf('//www.google') === -1) {
        return
    }
    $('#search div.g').last().after('<div id="cc"></div>')
    var s = $('#cc')

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
                    var hm = {}
                    var links = data.matchAll(/class="infringing_url">([^\s-<]+)\s*-\s*([0-9]+)/g)
                    for (const i of links) {
                        if (i[1] in hm) {
                            continue
                        }
                        hm[i[1]] = 1
                        var l = $('#l' + i[2])
                        if (l.length < 1) {
                            s.prepend('<div id="l' + i[2] + '" data-num="' + i[2] + '"></div>')
                            l = $('#l' + i[2])
                        }
                        l.append('<div class="g">'
                            + '<a href="http://' + i[1] + '" target="_blank">' + i[1] + ' (' + i[2] + ' URLs) </a>'
                            + '</div>')
                    }
                    var divs = $('div[data-num]', s)
                    divs.sort(function (a, b) {
                        return b.dataset.num - a.dataset.num
                    })
                    s.html(divs)
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

