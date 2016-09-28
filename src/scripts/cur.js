$(function(){
  (function(){
    var serviceTop = $('#service').offset().top - 150,
        caseTop = $('#case').offset().top - 150,
        teamTop = $('#team').offset().top - 150,
        navLeft = $('#header .nav').offset().left,
        curIndex = 0,
        $anchors = $('#header .link'),
        $anchorParents = $('#header .nav li'),
        $curBar = $('#cur-bar'),
        $headerContainer = $('#header .header-container');
    
    // 滑动到锚链接
    $anchors.click(function () {
      var hr = $(this).attr("href");
      var anh = $(hr).offset().top - 80;
      $("html,body").stop().animate({
        scrollTop: anh
      }, 1000);
      return false;
    });

    function getParam(index) {
      var i = index || curIndex,
          curWidth = $anchors.eq(i).width(),
          curLeft = $anchors.eq(i).offset().left - navLeft + 58;
      return {
        curWidth: curWidth,
        curLeft: curLeft
      };
    }

    function switchCur(index) {
      var params = getParam(index);
      $curBar.stop().animate({
        left: params.curLeft,
        width: params.curWidth
      }, 400);
    }


    $anchors.hover(function(){
      var width = $(this).width(),
          left = $(this).offset().left - navLeft + 58,
          i = $anchors.index($(this));
      $curBar.stop().animate({
        left: left,
        width: width,
      }, 400, function(){
        $anchorParents.eq(i).addClass('active').siblings('li').removeClass('active');
      });
    }, function(){
      var params = getParam();
      $curBar.stop().animate({
        left: params.curLeft,
        width: params.curWidth,
      }, 800, function(){
        $anchorParents.eq(curIndex).addClass('active').siblings('li').removeClass('active');
      });
    });

    function toggleScroll() {
      var scrollTop = $(window).scrollTop();
      if (scrollTop > 20) {
        $headerContainer.addClass('fixed');
      } else {
        $headerContainer.removeClass('fixed');
      }
      if (scrollTop < serviceTop) {
        curIndex = 0;
      } else if (scrollTop < caseTop) {
        curIndex = 1;
      } else if (scrollTop < teamTop) {
        curIndex = 2;
      } else {
        curIndex = 3;
      }
      switchCur(curIndex);
      $anchorParents.eq(curIndex).addClass('active').siblings('li').removeClass('active');
    }

    toggleScroll();

    $(window).scroll(toggleScroll);

  })();
});
