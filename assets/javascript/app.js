
var expressions = [
  "I am invincible.",
  "Wait!",
  "How are you.",
  "LMFAO",
  "Sure!",
  "WYD",
  "Are you sure.",
  "Why Not?",
  "What a witch.",
  "No School today!",
  "Prayers.",
  "I Want you.",
  "I give up.",
  "This is Phenomenal.",
  "I hate Monday."
];

var endpoint = "https://api.giphy.com/v1/gifs/search";

var gifyAPI = "3dbda82bd99349bf858085e01f35bbcc";
var limit = 15;
var rating = "r";

function renderButtons(renderLast) {
  $(".buttons").empty();
  for (var i = 0; i < expressions.length; i++) {
    var b = $("<button>");
    $(b).addClass("topic btn btn-primary");
    $(b).html(expressions[i]);
    $(".buttons").append(b);
  }

  $(".topic").click(function() {
    gimmeGIF(this);
  });

  if (renderLast) {
    gimmeGIF(".topic:last");
  }
}

 // Functions //

function gimmeGIF(topic) {

  $(".buttons .active").removeClass("active");
  $(topic).addClass("active");

  query = {
    api_key: gifyAPI,
    q: $(topic).html(),
    limit: limit,
    rating: rating
  };
  query = $.param(query);
  path = endpoint + "?" + query;

  $.ajax({
    url: path,
    type: "GET"
  })
    .done(function(response) {

      $(".card-columns").empty();
      // Loop through results
      var gifArray = response.data;
      for (var i = 0; i < gifArray.length; i++) {
       
        var imgSrc = gifArray[i].images.downsized_still.url;
        var imgLink = gifArray[i].url;
        var embedLink = gifArray[i].embed_url;
    
        var card = [
          "<div class='card'>",
          "<img class='card-img-top' src='" + imgSrc + "'>",
          "<div class='card-block'>",
          "<a href='" +
            imgLink +
            "' target='_blank' class=''><i class='fa fa-external-link' aria-hidden='true'></i>View on Giphy</a> ",
          "<a class='clip' data-toggle='tooltip' title='Copied!' data-clipboard-text='" +
            embedLink +
            "' href='#'><i class='fa fa-clipboard' aria-hidden='true'></i> Copy embed link</a>",
          "</div>",
          "<div class='card-footer card-inverse text-muted'>Rating: " +
            gifArray[i].rating.toUpperCase(),
          "</div>",
          "</div>"
        ];
  
        $(".card-columns").prepend(card.join(""));
      }
    })
    .fail(function() {
      console.log("error");
    });
}

function togglePlay(card) {

  var imgPath = $(card).attr("src");

  if (imgPath.endsWith("_s.gif")) {
    imgPath = imgPath.replace("_s.gif", ".gif");
  } else {
    imgPath = imgPath.replace(".gif", "_s.gif");
  }

  $(card).attr("src", imgPath);
}

$(document).ready(function() {
  renderButtons();

  $(".rating label").change(function(event) {
    rating = $(this)
      .text()
      .trim()
      .toLowerCase();
  });

  $("form").submit(function(event) {
    event.preventDefault();
    newTopic = $("#expression")
      .val()
      .trim();
    if (newTopic !== "") {
      expressions.push(
        $("#expression")
          .val()
          .trim()
      );
      renderButtons(true);
    }

    this.reset();
  });


  $(".gifs").on("click", ".card-img-top", function() {
    togglePlay(this);
  });

  $(".gifs").on("click", ".clip", function(event) {
    event.preventDefault();
  });

  clipboard = new Clipboard(".clip");
  clipboard.on("success", function(e) {
    e.clearSelection();
    if (e.action === "copy") {
      $(e.trigger).tooltip("show");
    }
  });
});
