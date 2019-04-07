window.onload = function()
{
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const source = document.getElementById("source");
    const destination = document.getElementById("destination");
    const start = document.getElementById("start");
    const seats = document.getElementById("seats");

    document.getElementById("btn").addEventListener('click', add);

    function add()
    {
        const data = JSON.stringify({
            "user" : name.value,
            "phone" : phone.value,
            "source" : source.value,
            "destination" : destination.value,
            "start": start.value,
            "seats_total" : seats.value
        });

        const api_url = "http://localhost:5000/add";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                if (this.responseText == "OK") {
                    name.value = "";
                    phone.value = "";
                    source.value = "";
                    destination.value = "";
                    start.value = "";
                    seats.value = "";
                    alert("Ride added succesfully!");
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
