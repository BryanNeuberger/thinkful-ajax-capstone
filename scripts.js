//Url to post to product-ycb channel
const slackURL = "https://slack.com/api/chat.postMessage";
const BRYAN_TEST_CHAN = 'https://hooks.slack.com/services/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';
const TOKEN = 'xoxp-2563595902-235736658752-300206171783-931eb6076e54b8cfe5c8aed18b9968c0';

let userSearch = '';
let userRating = 'pg';
let userLimit = '10';

const postMsg = (giphy, channName) => {

  const params = {
    token : TOKEN,
    channel : channName,
    text: giphy
  }

$.post(slackURL, params, response => {
  console.log(response)
})
  // $.post(`https://slack.com/api/chat.postMessage?token=${TOKEN}&channel=${channName}&text=${giphy}&pretty=1`, response => {
  //   console.log(response)
  // });

}

const memeHolderTemp = (imgUrl, title) => {
   return `
   <div class="gif-holder">
    <img src=${imgUrl} alt="${title}" class="img-click"/>
   </div>
   `
}

const disableScroll = () => {
  // lock scroll position, but retain settings for later
  let scrollPosition = [
    self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
    self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
  ];
  let html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
  html.data('scroll-position', scrollPosition);
  html.data('previous-overflow', html.css('overflow'));
  html.css('overflow', 'hidden');
  window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

const enableScroll = () => {
  // un-lock scroll position
  let html = jQuery('html');
  let scrollPosition = html.data('scroll-position');
  html.css('overflow', html.data('previous-overflow'));
  window.scrollTo(scrollPosition[0], scrollPosition[1])
}

//Listener like function to update range value
const updateRange = (myValue) => {
  $('#range-label').text(myValue);
  userLimit = myValue;
  handleSearch(userSearch, userLimit, userRating);
}

const handleSearch = (searchTxt, limit, rating) => {
  //remove any previous GIFS
  $('.gif-holder').remove();

    //construct query w/ parameters passed
    let query = {
      api_key: "0HRWse302Zmky7qvOdYVK4FKr97BR7Jl",
      q: searchTxt,
      limit: limit,
      offset: "0",
      rating: rating
    }

  //url need to attach end point
  const URL = 'http://api.giphy.com/v1/gifs/search'

  //JQuery methed used for the GET request of the user search
  $.getJSON(URL, query, response => {

    //Variable created for easier readibility
    const resArray = response.data;

    //loop through the returned JSON
    for (let el in resArray) {

      //Variable created for easier readibility
      let obj = resArray[el];

      //place data grabbed into templates and place into our div to display our list
      $('#section-meme-results').append(memeHolderTemp(obj.images.original.url, obj.title));
      $('.ani-play').remove();
    }
  });
}

////////////////////////
//                    //
//  JQuery Listeners  //
//                    //
////////////////////////
/*VVVVVVVVVVVVVVVVVVVV*/

//Handle submit search
$('form').on('submit', event => {
  event.preventDefault();
  userSearch = $('#input-search').val();

  handleSearch(userSearch, userLimit, userRating);
  $('.search-header').text('Showing Results For: ' + userSearch);
  $('#input-search').val('');
});
//END Handle submit search
/////////////////////////////////////

//Choose img to open modal
$('body').on('click', 'img', event => {
  const imgSrc = event.target.src;
  const imgAlt = event.target.alt;
  if ($(event.target).hasClass('img-click')) {
    disableScroll();
    $('body').append(`<div class="overlay"></div>
      <div class="light-box">
        <div class="inner-wrap">
          <h1>${imgAlt}</h1>
          <img src=${imgSrc} alt=${imgAlt} />
          <input type="text" id="chan-input" required="true" placeholder="#Channel to send this too"/>
          <div class="inner-btn-wrap">
            <button class="btn-light" id="btn-ok" data-tip="Press to continue">SEND</button>
            <button class="btn-light" id="btn-cancel" data-tip="Press to exit pop-up">CANCEL</button>
          </div>
        </div>
      </div>`);

    $('#btn-cancel').on('click', event => {

      $('.overlay').remove();
      $('.light-box').remove();
      enableScroll();
    });
    $('#btn-ok').on('click', event => {

      //intro to new form div to collect data for channel
      if ($('#chan-input').val() === '') {
        showToolTip($('#chan-input'),'please fill in chan name for input');
      } else {
        postMsg(imgSrc, $('#chan-input').val());
        $('.overlay').remove();
        $('.light-box').remove();
        enableScroll();
      }

    });
  }
});
//END Choose img to open modal
//////////////////////////////////////////

//Open menu toggle
$('#btn-filter').click(event => {
  if ($('#filter-menu').hasClass('menu-hide')) {
    $('#filter-menu').removeClass('menu-hide');
    $('#filter-menu').addClass('menu-show');
  } else {
    $('#filter-menu').addClass('menu-hide');
    $('#filter-menu').removeClass('menu-show');
  }
});
//END Open menu toggle
//////////////////////////////////////////

//Document Ready listeners
$(document).ready(function () {

  //radio listeners
  $('input[type=radio][name=rating]').change(function() {
    userRating = $("input[name='rating']:checked").val();
    handleSearch(userSearch, userLimit, userRating);
  });

  //scroll to top click listener
  $('#btn-backToTop').click(event => {
    $("HTML, BODY").animate({ scrollTop: 0 }, 1000);
  });

})
//END Document Ready listeners
//////////////////////////////////////////



//tooltip listeners
$(document).on('mouseover', 'button', event => {
  showToolTip($(event.target), $(event.target).attr('data-tip'))
});


$(document).on('mouseover', 'img', event => {
  showToolTip($(event.target), $(event.target).attr('alt'));
});

const showToolTip = (targetEl, text) => {
  let p = $(targetEl).offset();
  let h = $(targetEl).outerHeight();
  $('body').append(`<div class="tooltip" style="top:${(p.top) - $(window).scrollTop() + h}px; left:${p.left}px"><p>${text}</p></div>`);
}

$('body').on('mouseleave', '*', event => {
  $('.tooltip').remove();
});
//END tooltip listeners
//////////////////////////////////////////



