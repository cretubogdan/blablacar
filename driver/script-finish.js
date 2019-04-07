window.onload = function()
{
    const name = document.getElementById("name");
    const source = document.getElementById("source");
    const destination = document.getElementById("destination");
    const start = document.getElementById("start");

    document.getElementById("btn").addEventListener('click', finish);

    function finish()
    {
        const data = JSON.stringify({
            "user" : name.value,
            "source" : source.value,
            "destination" : destination.value,
            "start": start.value,
        });

        const api_url = "http://localhost:5000/finish";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                if (this.responseText == "OK") {
                    name.value = "";
                    source.value = "";
                    destination.value = "";
                    start.value = "";
                    alert("Finish ride was marked succesfully!");
                }
                else {
                    alert("Something went wrong, please try again!");
                }
            }
        };
        xhttp.open("POST", api_url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(data);
    }
}
