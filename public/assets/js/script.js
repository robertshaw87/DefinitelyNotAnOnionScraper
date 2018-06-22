$(function () {

  $(document).on("click", "#rescrape-button", function(event) {
    $.get("/api/scrape");
  })

  $(document).on("click", "#saved-articles-button", function(event) {
    $.get("/saved");
  })

  $(document).on("click", ".save-toggle", function(event) {
    console.log($(this).data("id"))
    console.log(!$(this).data("saved"))
    $.post(`/api/save/${$(this).data("id")}`, {saved: !$(this).data("saved")}, function (data) {
      console.log(data)
      window.location.reload();
    })
  })

})