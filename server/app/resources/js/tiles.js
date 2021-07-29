"use strict"

$(function () {
    $(".tiles").mousedown(function () {
        $(this).addClass("selectedtile");
    });

    $(".tiles").mouseup(function () {
        $(this).removeClass("selectedtile");
    });
});


