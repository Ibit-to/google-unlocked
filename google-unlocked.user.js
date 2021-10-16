// ==UserScript==
// @name         Google Unlocked
// @version      1.5
// @namespace    45c9a6614fccd4edff9592da
// @description  Google Unlocked scans hidden search results that were censored by Google due to complaints
// @home         https://github.com/Ibit-to/google-unlocked
// @supportURL   https://github.com/Ibit-to/google-unlocked/issues
// @updateURL    https://raw.githubusercontent.com/Ibit-to/google-unlocked/master/google-unlocked.user.js
// @downloadURL  https://raw.githubusercontent.com/Ibit-to/google-unlocked/master/google-unlocked.user.js
// @author       Ibit - The Best Torrents
// @license      MIT License
// @icon         https://raw.githubusercontent.com/Ibit-to/google-unlocked/master/extension/32.png
// @include      *://www.google.*/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @noframes
// ==/UserScript==

/* eslint-env browser, es6, greasemonkey, jquery */

$(function () {
    console.log('Loaded!')

    if (window.location.href.indexOf('//www.google') === -1) {
        console.log('First return!')
        return;
    }

    $('#search div.g').last().after('<div id="cc"></div>')
    const s = $('#cc')

    let firstRun = true
    $('div i > a').each((i, a) => {
        if (a.href === 'https://www.google.com/support/answer/1386831') {
            console.log('Second return!\n(The post answer)')
            return;
        }

        // Give a loading feedback to user
        firstRun && s.prepend(`
        <div style="display: inline-flex;align-items: center;">
           <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
              <path fill="#4285f4" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                 <animateTransform attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="0.6s"
                    repeatCount="indefinite"
                 />
              </path>
           </svg>
           <h2>Loading uncensored links...</h2>
        </div>
        `)

        firstRun = false

        GM_xmlhttpRequest({
            method: 'GET',
            url: a.href,
            timeout: 30000, // In milliseconds. If your connection is slow I'll suggest you to increase the time or just comment this line.
            onload: (response) => {
                console.log('Loaded!', response)

                let hm = {}
                const links = response.responseText.matchAll(/class="infringing_url">([^\s-<]+)\s*-\s*([0-9]+)/g)

                for (const i of links) {
                    console.log(i)
                    if (i[1] in hm) continue;

                    hm[i[1]] = 1
                    let l = $('#l' + i[2])
                    if (l.length < 1) {
                        s.prepend(`<div id="l${i[2]}" data-num="${i[2]}"></div>`)
                        l = $('#l' + i[2])
                    }
                    l.append(`
                    <div class="g">
                       <a href="http://${i[1]}" target="_blank">${i[1]} (${i[2]} URLs)</a>
                    </div>
                    `)
                }
                const divs = $('div[data-num]', s)
                divs.sort((a, b) => b.dataset.num - a.dataset.num)
                s.html(divs)
            },
            onerror: (err) => {
                console.error('Request Error!\n', err.error)
                s.html(`
                <h2 style="color: red; display: block;">
                   Error trying to get uncensored links!
                   <br/>
                   Check console for more information
                </h2>
                `)
            },
            ontimeout: () => console.warn(`[${i}] Request timeout`)
        })
    })
})
