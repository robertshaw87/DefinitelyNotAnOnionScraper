$(function () {

  $(document).on("click", ".save-toggle", function(event) {
    $.post(`/api/save/${$(this).data("id")}`, {saved: !$(this).data("saved")}, function (data) {
      window.location.reload();
    })
  })

  $(document).on("click", ".article-note", function (event) {
    $("#note-title").empty();
    $("#note-body").empty();
    $("#note-save").data("id", "");
    // Save the id from the p tag
    var articleID = $(this).data("id");
    var noteID = $(this).data("noteid");
    var noteTitle = $(this).data("title");
    var noteBody = $(this).data("body");
    $("#note-itle").val(noteTitle);
    $("#note-body").val(noteBody);
    $("#note-save").data("id", articleID);
  });

  $(document).on("click", "#note-save", function (event) {
    var articleID = $("#note-save").data("id");
    var newNote = {};
    newNote.title = $("#note-itle").val();
    newNote.body = $("#note-body").val();

    $.post(`/api/note/${articleID}`, newNote, function (data) {
      window.location.reload();
    })
  })

})