$(function () {

  $(document).on("click", ".save-toggle", function(event) {
    console.log($(this).data("id"))
    console.log(!$(this).data("saved"))
    $.post(`/api/save/${$(this).data("id")}`, {saved: !$(this).data("saved")}, function (data) {
      console.log(data)
      window.location.reload();
    })
  })

  

})