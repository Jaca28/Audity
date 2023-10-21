var fileHashOutput;
var sign_table;
var i = 0;

document.forms['filehash'].elements['myfilehash'].onchange = function(evt) {
    if (!window.FileReader) return; // Browser is not compatible

    var reader = new FileReader();

    reader.onload = function(evt) {
        if (evt.target.readyState != 2) return;
        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        filecontent = evt.target.result;
        console.log("Archivo Leido:" + filecontent);
        fileHashOutput = CryptoJS.SHA256(filecontent);
        document.getElementById("file_hash").innerHTML = fileHashOutput;
        console.log("Hash:" + fileHashOutput);

    };

    reader.readAsText(evt.target.files[0]);
};
