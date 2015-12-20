$(function () {
  $('.variant').on('change', function (e) {
    e.preventDefault();

    $(this)
      .parents('.course-description')
      .addClass('completed')
      .find('.next-test')
      .removeClass('disabled');
  });

  $('.next-test').on('click', function (e) {
    if (e.target.type === 'submit') {
      return;
    }

    e.preventDefault();

    $(this)
      .parents('.course-description')
      .hide()
      .next()
      .show();

    var percent = Math.round($('.completed').length / $('.course-description').length * 100) + '%';
    $('.progress-level').text(percent);
    $('.progress-bar').css('width', percent);
  });

  $('.prev-test').on('click', function () {
    $(this)
      .parents('.course-description')
      .hide()
      .prev()
      .show();
  });
});
