var correct_answer;
function getData(country) {
    // Builds a Fusion Tables SQL query and hands the result to  dataHandler
    var queryUrlHead = 'https://www.googleapis.com/fusiontables/v1/query?sql=';
    var queryUrlTail = '&key=';
    var tableId = '1tPQ9xXwgQU0M_1fYK6AvFqcgf--31LOWnAy0RVN6';

    // write your SQL as normal, then encode it
    var query = "SELECT 'ISO_2DIGIT' FROM "+ tableId +" WHERE 'OBJECTID' =" + country

    var queryurl = encodeURI(queryUrlHead + query + queryUrlTail);

    var jqxhr = $.get(queryurl, dataHandler, "jsonp");

}
function dataHandler(resp) {
    var correct = resp.rows[0];
    var correct = correct[0]
    correcter(correct)


}
function correcter(answer)
{
    if (i == 0)
    {
        correct_answer = answer
        console.log("Answer")
        console.log(correct_answer)
    i++
    }else{
        var user_answer = answer
        console.log(correct_answer)

    }
    checker(correct_answer, user_answer)
}
function checker(correct, user)
{
    console.log("Computer answer")
    console.log(correct)
    console.log("User guess")
    console.log(user)
    if (undefined != user)
    {
        if (user == correct)
        {
            console.log("Thats correct!")
        var layer1 = new google.maps.FusionTablesLayer({
          query: {
            select: 'geometry',
            from: '1tPQ9xXwgQU0M_1fYK6AvFqcgf--31LOWnAy0RVN6',
            where: "ISO_2DIGIT = '" + correct +"'"
          },
          styles: [{
            polygonOptions: {
              fillColor: '#00FF00',
            }
          }]
        });
        layer1.setMap(map);

        }
        else{
            console.log("Sorry, thats wrong");
            console.log("Correct answer was");
            console.log(correct);
            console.log("Your guess was");
            console.log(user);
        var layer1 = new google.maps.FusionTablesLayer({
          query: {
            select: 'geometry',
            from: '1tPQ9xXwgQU0M_1fYK6AvFqcgf--31LOWnAy0RVN6',
            where: "ISO_2DIGIT ='" + user +"'"
          },
        styles: [{
            polygonOptions: {
              fillColor: '#ff0000',
            }
          }]
        });
        layer1.setMap(map);
        var layer2 = new google.maps.FusionTablesLayer({
                  query: {
                    select: 'geometry',
                    from: '1tPQ9xXwgQU0M_1fYK6AvFqcgf--31LOWnAy0RVN6',
                    where: "ISO_2DIGIT = '" + correct +"'"
                  },
        });
                layer2.setMap(map);



        }
        layer1.setMap(map);

    if (undefined != user && user.length > 2)
    {
        console.log("Sorry, the geodata isn't very accurate. Please make a new guess in the same country")
    }
}
}