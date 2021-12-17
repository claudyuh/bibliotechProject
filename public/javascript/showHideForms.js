function myFunction() {
    var btn = document.getElementById("pwForm");
    if (btn.style.display === "none") {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
}

function myFunction1() {
    var x = document.getElementById("editName");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function myFunction2() {
    var el = document.getElementById("editEmail");
    if (el.style.display === "none") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
}

function toggle_visibility(id) {
  var e = document.getElementById('txtReview');
  if(e.style.display == 'block')
      e.style.display = 'none';
  else
      e.style.display = 'block';
}

function myFunction3() {
  var x = document.getElementById("deleteaccount");
  if (x.style.display === "none") {
      x.style.display = "block";
  } else {
      x.style.display = "none";
  }
}

