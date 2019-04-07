window.onload = function()
{
    const rider_name = document.getElementById("rider_name");
    const rider_phone = document.getElementById("rider_phone");
    const driver_name = document.getElementById("driver_name");
    const source = document.getElementById("source");
    const destination = document.getElementById("destination");
    const start = document.getElementById("start");

    document.getElementById("btn").addEventListener('click', reserve);

    function reserve()
    {
        const data = JSON.stringify({
            "rider" : rider_name.value,
            "rider_phone" : rider_phone.value,
            "driver" : driver_name.value,
            "source" : source.value,
            "destination" : destination.value,
            "start": start.value,
        });

        const api_url = "http://localhost:5000/reserve";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                if (this.responseText == "OK") {
                    rider_name.value = "";
                    rider_phone.value = "";
                    driver_name.value = "";
                    source.value = "";
                    destination.value = "";
                    start.value = "";
                    alert("Reservation made succesfully!");
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
