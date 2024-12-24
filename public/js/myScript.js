var interval = null;
var dataInterval = 100;
var iterate = 0;

const canvas = new fabric.Canvas('canvas', {
  backgroundColor: 'transparent'
});

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
      createCanvas();
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

document.getElementById('downloadButton').addEventListener('click', function () {
  document.getElementById('downloadButton').style.opacity = 0;
  document.getElementById('stickerButton').style.opacity = 0;
  // Capture the content of the <body> using html2canvas
  html2canvas(document.body,{
    scale: 3, // Increase the scale for higher resolution (3x is a good start)
  }).then(function (canvas) {
    // Create an "a" element to trigger the download
    var link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'ayatemas.png';
    link.click();
    document.getElementById('downloadButton').style.opacity = 1;
    document.getElementById('stickerButton').style.opacity = 1;
  });
});

function createCanvas() {
  var canvasu = document.getElementById("canvas-wrapper");
  canvasu.style.display = "inline-block";

  // =================== CANVAS ====================

  canvas.setWidth(document.getElementById("canvas-wrapper").clientWidth);
  canvas.setHeight(document.getElementById("canvas-wrapper").clientHeight);

  canvas.requestRenderAll();
}

function addSticker(svgItem) {
  var group = [];

  fabric.loadSVGFromURL("./public/assets/svg/" + svgItem + ".svg", function (objects, options) {
    var loadedObjects = new fabric.Group(group);
    var svg = fabric.util.groupSVGElements(objects, options);
    svg.setControlsVisibility(HideControls);
    loadedObjects.set({
      left: 100,
      top: 300,
      width: 60,
      height: 60,
    });

    svg.scaleToWidth(100);
    svg.scaleToHeight(100);
    canvas.add(loadedObjects);
    canvas.requestRenderAll();
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';

  }, function (item, object) {
    object.set('id', item.getAttribute('id'));
    group.push(object);
  }, { crossOrigin: 'anonymous' });
  canvas.requestRenderAll();
}
// =================== CANVAS ====================
// =================== ADD TEXT ===================

$('#fill').change(function () {
  var obj = canvas.getActiveObject();

  if (obj) {
    // old api
    // obj.setFill($(this).val());
    obj.set("fill", this.value);
  }
  canvas.renderAll();
});

$('#font').change(function () {
  var obj = canvas.getActiveObject();

  if (obj) {
    obj.set("fontFamily", "MyriadPro");
  }

  canvas.renderAll();
});

function addText() {
  var oText = new fabric.IText('Ketuk dua kali untuk ubah text', {
    left: 100,
    top: 300,
    fill: 'white',
    fontSize: 24,
    fontFamily: 'MyriadPro',
  });

  canvas.add(oText);
  
  oText.bringToFront();
  canvas.setActiveObject(oText);
  $('#fill, #font').trigger('change');
  canvas.requestRenderAll();
  var modal = document.getElementById('myModal');
  modal.style.display = 'none';
}

fabric.util.addListener(canvas.upperCanvasEl, 'dblclick', function(e) {
  console.log('a');
  if (canvas.findTarget(e)) {
     let objType = canvas.findTarget(e).type;
     if (objType === 'i-text') {
        // Find the IText object
        let iTextObject = canvas.findTarget(e);
        if(iTextObject.text == 'Ketuk dua kali untuk ubah text'){
          // Set the text to an empty string
        iTextObject.set({ text: '' });
        }
        // Render the canvas to apply the changes
        canvas.renderAll();

        // Show controls
       // document.getElementById('textControls').hidden = false;
     }
  }
});


function addDeleteBtn(x, y) {
  $(".deleteBtn").remove();
  var btnLeft = x - 10;
  var btnTop = y - 10;
  var deleteBtn = '<img src="http://www.imcjms.com/assets/images/close-window.png" class="deleteBtn" style="position:absolute;top:' + btnTop + 'px;left:' + btnLeft + 'px;cursor:pointer;width:20px;height:20px;"/>';
  $(".canvas-container").append(deleteBtn);
}

canvas.on('object:selected', function (e) {
  addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
});

canvas.on('mouse:down', function (e) {
  if (!canvas.getActiveObject()) {
    $(".deleteBtn").remove();
  }
});

canvas.on('object:modified', function (e) {
  addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
});

canvas.on('object:scaling', function (e) {
  $(".deleteBtn").remove();
});
canvas.on('object:moving', function (e) {
  $(".deleteBtn").remove();
});
canvas.on('object:rotating', function (e) {
  $(".deleteBtn").remove();
});
$(document).on('click', ".deleteBtn", function () {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());
    $(".deleteBtn").remove();
  }
});

//modal
var openModalBtn = document.getElementById('stickerButton');
var closeModalBtn = document.getElementById('closeModalBtn');
var modal = document.getElementById('myModal');

// Open the modal
openModalBtn.addEventListener('click', function () {
  modal.style.display = 'block';
});

// Close the modal
closeModalBtn.addEventListener('click', function () {
  modal.style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

