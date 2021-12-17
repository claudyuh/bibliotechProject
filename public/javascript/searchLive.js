
var delayTimer;
function searchLive(str) {
    if(str.length > 1) {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        $.get('/search', {search: str}, function(data){
          window.history.pushState('', '', `/search?search=${str}&pg=1`)
          $("#result").html(data)
          }); 
          $('#result').siblings().hide()
          $('#result').parents().siblings().hide()
          $('nav').show()
      }, 300)
    }
  }





