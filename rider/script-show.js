window.onload = function()
{
    const source = document.getElementById("source");
    const destination = document.getElementById("destination");
    const table = document.getElementById("my_table");
    table.innerHTML = (make_table() + "</table>");

    const DRIVER = 0
    const RIDERS = 1
    const SOURCE = 2
    const DESTINATION = 3
    const START = 4
    const SEATS_AVAILABLE = 5
    const SEATS_TOTAL = 6

    function make_table()
    {
        var html_to_add = "";
        html_to_add += "<table>";
        html_to_add += "<tr>";
        html_to_add += "<th>Driver</th>";
        html_to_add += "<th>Riders</th>";
        html_to_add += "<th>Source</th>";
        html_to_add += "<th>Destination</th>";
        html_to_add += "<th>Start</th>";
        html_to_add += "<th>Seats Available</th>";
        html_to_add += "<th>Seats Total</th>";
        html_to_add += "</tr>";

        return html_to_add;
    }

    document.getElementById("btn").addEventListener('click', show);

    function show()
    {
        const data = JSON.stringify({
            "source" : source.value,
            "destination" : destination.value,
        });

        const api_url = "http://localhost:5000/show";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                source.value = "";
                destination.value = "";

                var array_rides = JSON.parse(this.responseText).results;
                var rides_length = array_rides.length;
                var html_to_add = "";

                html_to_add = make_table();
                for (var i = 0;i < rides_length;i++) {
                    html_to_add += "<tr>";
                    html_to_add  += "<td>" + array_rides[i][DRIVER] + "</td>";
                    var riders = "";
                    if (array_rides[i][RIDERS] != "") {
                        riders = array_rides[i][RIDERS].replace(/\|/g, "<br>").substring(4);
                    }
                    html_to_add  += "<td>" + riders + "</td>";
                    html_to_add  += "<td>" + array_rides[i][SOURCE] + "</td>";
                    html_to_add  += "<td>" + array_rides[i][DESTINATION] + "</td>";
                    html_to_add  += "<td>" + array_rides[i][START] + "</td>";
                    html_to_add  += "<td>" + array_rides[i][SEATS_AVAILABLE] + "</td>";
                    html_to_add  += "<td>" + array_rides[i][SEATS_TOTAL] + "</td>";
                    html_to_add  += "</tr>";
                }
                html_to_add  += "</table>";

                table.innerHTML = html_to_add;
            }
        };
        xhttp.open("POST", api_url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(data);
    }
}
