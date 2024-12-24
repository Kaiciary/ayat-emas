var interval = null;
var dataInterval = 100;
var iterate = 0;

var HideControls = {
  'tl': true,
  'tr': false,
  'bl': true,
  'br': true,
  'ml': true,
  'mt': true,
  'mr': true,
  'mb': true,
  'mtr': true
};

const btnKado = $("#kado");
var download = document.getElementById('buttonContainer');
//var wish = document.getElementById('wishContainer');
download.style.display = 'none';

btnKado.on('click', function () {
  var fadeTarget = document.getElementById('kado');
  var fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, 40);
  getData();
});

async function getData() {
  $.ajax({
    url: 'https://ayat-emas-backend-49cae8c24038.herokuapp.com/getAyatEmas',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      showData(data);
    },
    error: function (xhr, status, error) {
      console.error('Error:', status, error);
    }
  });
}

function showData(json) {
  interval = setInterval(function () {
    if (iterate == 20) {
      clearInterval(interval);
      dataInterval = 300;
      showData(json);
    }
    else if (iterate == 23) {
      clearInterval(interval);
      dataInterval = 400;
      showData(json);
    }
    else if (iterate == 27) {
      clearInterval(interval);
      dataInterval = 500;
      showData(json);
    }
    else if (iterate == 29) {
      clearInterval(interval);
      startConfetti();
      download.style.display = 'flex';
      //wish.style.display = 'block';
      // Clear the timeout before it runs (for example, after 2 seconds)
      var myTimeout = setTimeout(function () {
        stopConfetti();
        clearTimeout(myTimeout);
      }, 2000);
    }
    var check = document.getElementById('ayat').childNodes[0];
    var check2 = document.getElementById('isi').childNodes[0];

    var rand = Math.floor(Math.random() * 200);
    var text = document.createTextNode(json[rand].ayat);
    var isi = document.createTextNode(json[rand].isi);

    document.getElementById("ayat").replaceChild(text, check);
    document.getElementById("isi").replaceChild(isi, check2);
    iterate++;
  }, dataInterval);
}

async function downloadImage(res) {
  try {
    $('#wait').css('display', 'block');
    // Make the request to the server to get the image
    const response = await fetch('https://ayat-emas-backend-49cae8c24038.herokuapp.com/download-ayat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: document.getElementById("ayat").innerText,
        content: document.getElementById("isi").innerText,
        resolution: res
      })
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch the image');
    }

    // Convert the response to a blob
    const imageBlob = await response.blob();

    // Create an object URL from the blob
    const imageUrl = URL.createObjectURL(imageBlob);

    // Optionally, create an anchor element to trigger a download
    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = 'ayat-emas_' + res + '.png';  // Specify the file name
    anchor.click();  // Trigger the download
    $('#wait').css('display', 'none');
  } catch (error) {
    console.error('Error downloading the image:', error);
  }
}

//modal
var openModalBtn = document.getElementById('downloadButton');
var closeModalBtn = document.getElementById('closeModalBtn');
var modal = document.getElementById('myModal');

// Open the modal
openModalBtn.addEventListener('click', function () {
  modal.style.display = 'block';
});

// Close the modal
/*closeModalBtn.addEventListener('click', function () {
  modal.style.display = 'none';
});*/

// Close the modal if the user clicks outside of it
window.addEventListener('click', function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

