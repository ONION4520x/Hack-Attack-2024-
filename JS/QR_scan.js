const scanner = new Html5QrcodeScanner("qr-reader", {
  // Scanner will be initialized in DOM inside element with id of 'qr-reader'
  qrbox: {
    width: 400,
    height: 400,
  }, // Sets dimensions of scanning box (set relative to qr-reader element width)
  fps: 20, // Frames per second to attempt a scan
});

scanner.render(success, error);
// Starts scanner

function success(result) {
  //if the scan success the game redirect starts here.
  document.getElementById("result").innerHTML = `
    <h2>Success!</h2>
    <p><a href="${result}">${result}</a></p>
    `;

  scanner.clear();
  // Clears scanning instance
}

function error(err) {
  // Prints any errors to the console
  console.error(err);
}
