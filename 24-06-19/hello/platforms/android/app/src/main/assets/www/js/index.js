 var mediaRecorder;
 var recordedBlobs = [];

var app = {
  startCameraAbove: function(){

  navigator.mediaDevices.getUserMedia({
      'audio': true,
      'video': {
          facingMode: 'user'
      }
  }).then(function(mediaStream) {
      // setSrcObject(stream, video);

       var video=document.getElementById('my-preview')
       video.srcObject = mediaStream;


                  // Start to display the preview on the video element
                  // and mute the video to disable the echo issue !
                  video.play();
                  video.muted = true;

                 var options = { mimeType : 'video/webm'};
                 mediaRecorder = new MediaRecorder(mediaStream, options);
                 console.log("is mime type supported");
                 console.log(MediaRecorder.isTypeSupported(options.mimeType));
                 mediaRecorder.onstart = function() {
                     console.log('Recording Started');
                 };



                 mediaRecorder.ondataavailable = function(event) {
                    if (event.data && event.data.size > 0) {
                        recordedBlobs.push(event.data);
                      }
                   };
                  mediaRecorder.start();


  });

   /*
    CameraPreview.startCamera({x: 50, y: 50, width: 300, height: 300, toBack: false, previewDrag: true, tapPhoto: true});

    */
  },
  changeOrientation:function(){

   var constraints = navigator.mediaDevices.getSupportedConstraints();
    console.log(constraints);
    alert(JSON.stringify(constraints));
	  alert("orientation change event");
	 console.log('Orientation is1 ' + screen.orientation.type);
	  screen.orientation.lock('landscape-primary');
	  console.log('Orientation is2 ' + screen.orientation.type);
/*
	  var options={
      			isAudio:true,
      			width: 720,
      			height: 1280,
      			bitRate:  6 * 1000000,
      			dpi:1
      				};
      				*/


      				 var options={
                          			isAudio:true,
                          			width: 1920,
                          			height: 1080,
                          			bitRate:  6 * 1000000,
                          			dpi:72
                          				};




      	  var filePath="/sdcard/NIAAgentDoc/test2.mp4";

      	  function success()
      	  {
      		  console.log("starterd");
      		  window.plugins.bringtofront();
      	  }

      	  function error()
      	  {
      		  console.log("error");
      	  }


      	  ScreenRecord.startRecord(options, filePath, success, error)
	  
  },

  startCameraBelow: function(){
    CameraPreview.startCamera({x: 50, y: 50, width: 300, height:300, camera: "front", tapPhoto: true, previewDrag: false, toBack: true});
  },

  stopCamera: function(){
    /*
      mediaRecorder.ondataavailable = function(blob) {
                console.log('Data Available: blob size is ' + blob.size);
                console.log('File URI is '+ mediaRecorder.src);
            };

            mediaRecorder.requestData();

         */

        mediaRecorder.stop();






  mediaRecorder.onstop = function() {
      console.log('Recording Stopped');
      console.log(recordedBlobs);

      window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

          console.log('file system open: ' + fs.name);
          createFile(fs.root, "newTempFile.mp4", false);

          function createFile(dirEntry, fileName, isAppend) {
              // Creates a new file or returns the file if it already exists.
              dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

                  writeFile(fileEntry, null, isAppend);

              }, onErrorCreateFile);

          }


          function onErrorCreateFile()
          {
             console.log("create file error");
          }


          writeFile(fs,recordedBlobs);
          function writeFile(fileEntry, dataObj) {
              // Create a FileWriter object for our FileEntry (log.txt).
              fileEntry.createWriter(function (fileWriter) {

                  fileWriter.onwriteend = function() {
                      console.log("Successful file write...");
                     // readFile(fileEntry);
                  };

                  fileWriter.onerror = function (e) {
                      console.log("Failed file write: " + e.toString());
                  };

                  // If data object is not passed in,
                  // create a new Blob instead.
                  if (!dataObj) {
                      dataObj = new Blob(['some file data'], { type: 'text/plain' });
                  }

                  fileWriter.write(dataObj);
              });
          }



      }, onErrorLoadFs);

      function onErrorLoadFs()
      {
        console.log("create file error");
      }



  };
  mediaRecorder.stop();





     /*
    CameraPreview.stopCamera();
    function success1()
    	  {
    		  console.log("starterd1");
    	  }

    	  function error1()
    	  {
    		  console.log("error1");
    	  }
    	ScreenRecord.stopRecord(success1, error1)

    	*/
  },

  takePicture: function(){
    CameraPreview.takePicture(function(imgData){
      document.getElementById('originalPicture').src = 'data:image/jpeg;base64,' + imgData;
    });
  },

  switchCamera: function(){
    CameraPreview.switchCamera();
  },

  show: function(){
    CameraPreview.show();
  },

  hide: function(){
    CameraPreview.hide();
  },

  changeColorEffect: function(){
    var effect = document.getElementById('selectColorEffect').value;
    CameraPreview.setColorEffect(effect);
  },

  changeFlashMode: function(){
    var mode = document.getElementById('selectFlashMode').value;
    CameraPreview.setFlashMode(mode);
  },

  changeZoom: function(){
    var zoom = document.getElementById('zoomSlider').value;
    document.getElementById('zoomValue').innerHTML = zoom;
    CameraPreview.setZoom(zoom);
  },

  changePreviewSize: function(){
    window.smallPreview = !window.smallPreview;
    if(window.smallPreview){
      CameraPreview.setPreviewSize({width: 100, height: 100});
    }else{
      CameraPreview.setPreviewSize({width: window.screen.width, height: window.screen.height});
    }
  },

  showSupportedPictureSizes: function(){
    CameraPreview.getSupportedPictureSizes(function(dimensions){
      dimensions.forEach(function(dimension) {
        console.log(dimension.width + 'x' + dimension.height);
      });
    });
  },

  init: function(){
    document.getElementById('startCameraAboveButton').addEventListener('click', this.startCameraAbove, false);
    document.getElementById('startCameraBelowButton').addEventListener('click', this.startCameraBelow, false);
    document.getElementById('stopCameraButton').addEventListener('click', this.stopCamera, false);
    document.getElementById('changeOrientationButton').addEventListener('click', this.changeOrientation, false);


    /*
    document.getElementById('changeOrientationButton').addEventListener('click', this.changeOrientation, false);
    document.getElementById('switchCameraButton').addEventListener('click', this.switchCamera, false);
    document.getElementById('showButton').addEventListener('click', this.show, false);
    document.getElementById('hideButton').addEventListener('click', this.hide, false);
    document.getElementById('takePictureButton').addEventListener('click', this.takePicture, false);
    document.getElementById('selectColorEffect').addEventListener('change', this.changeColorEffect, false);
    document.getElementById('selectFlashMode').addEventListener('change', this.changeFlashMode, false);
	*/
	

    if(navigator.userAgent.match(/Android/i)  == "Android"){
      document.getElementById('zoomSlider').addEventListener('change', this.changeZoom, false);
    }else{
      document.getElementById('androidOnly').style.display = 'none';
    }

    window.smallPreview = false;
    document.getElementById('changePreviewSize').addEventListener('click', this.changePreviewSize, false);

    document.getElementById('showSupportedPictureSizes').addEventListener('click', this.showSupportedPictureSizes, false);

    // legacy - not sure if this was supposed to fix anything
    //window.addEventListener('orientationchange', this.onStopCamera, false);
  }
};

document.addEventListener('deviceready', function(){	
  app.init();
}, false);
