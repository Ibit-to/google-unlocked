$(function () {

    if (window.location.href.indexOf('//www.google') === -1) {
        return
    }
    $('head').append('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">')
    s = $('#search div.g').last()

    $('div i > a').each(function (i, a) {
        if (a.textContent.toLowerCase().indexOf('complaint') === -1) {
            return
        }
        $.ajax({
            type: 'GET',
            url: 'https://cors-anywhere.herokuapp.com/' + a.href,
            dataType: 'html',
            success: function (data) {
                links = data.match(/>(https?:\/\/[^<]+)<\/li>/g)
                for (i in links) {
                    u = links[i].replace('</li>', '').replace('>', '')
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

