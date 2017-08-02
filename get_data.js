/*Globala variabler som behöver nås utan att ändras på. */
var correct_answer;
var i = 0;
var right;
var wrong;
function randomizer()
{
      /*Slumpar fram ett nummer mellan 1 och 236*/
    var country = Math.floor((Math.random() * 236) + 1);
    getData(country);

}
function getData(country) {
    /*Denna funktioner skapar en query till google api i SQL form*/
    var queryUrlHead = 'https://www.googleapis.com/fusiontables/v1/query?sql=';
    var queryUrlTail = '&key=AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME';
    var tableId = '1tPQ9xXwgQU0M_1fYK6AvFqcgf--31LOWnAy0RVN6';

    var query = "SELECT 'ISO_2DIGIT', 'Name', 'Shape_Area' FROM "+ tableId +" WHERE 'OBJECTID' =" + country

    var queryurl = encodeURI(queryUrlHead + query + queryUrlTail);

    var jqxhr = $.get(queryurl, dataHandler, "jsonp");

}
function dataHandler(resp) {
    /*Denna funktion får datan från tidigare Queryn. Variabler skapas för lättare åtkomst.*/
    var correct = resp.rows[0];
    var area = correct[2]
    if(area > 9)
        /*Då det finns många länder i världen bestämde jag att länder som har en area över 9, vilket är i tals med Irland, 
        alltid bör visas. Detta på grund av att Google Fusion tabellen jag använder mig av har "länder" i sig som egentligen
        är självständiga öar, som ägs av ett land. Exempelvis Faroe Islands och liknande, dessa syns knappt på kartan
        Och ett val gjordes över att filtrera bort dessa. */
        {
        country_name = correct[1]

        var correct = correct[0]
        console.log(country_name)
/*Ledtråden läggs in här. Tanken är att i queryn också ledtråden om landet ska skickas med, så att man lätt kan skriva 
upp den här*/
        $("#clue_box").text("The country is known as " + country_name);

        correct_answer = correct
        guessButton.disabled= false;

    }else if (area <9){
        /*Om arean är mindre än 9 så körs tidigarenämnda funktioner igenom igen.*/
        randomizer()
    }



}
function correcter(answer)
{
    /*I denna funktion jämförs gissningen och det korrekta svaret. Om man har klickat på "Make a guess" så försvinner
    möjligheten att göra en gissning, och man kan istället gå vidare till nästa land att gissa. Detta görs med hjälp av
    Jquery.*/
        var user_answer = answer
        $("#newGame").show();
        $("#guessButton").hide();

    if(undefined != user_answer)
{
    checker(correct_answer, user_answer)
}
}

function checker(correct, user)
{
    /*Då Svaret kan komma tillbaka som undefined av användaren, då rätt svar går igenom denna nästan all kod i Get_data.js
    Så körs inte denna del av koden förrän ett svar har tillkommit från användaren. */

    if (undefined != user)
    {
        /*Om svaret från användaren och rätt svar är detsamma, så körs denna kod som gör att rätt svar blir utmärkt i grönt.
        Med hjälp av Google Fusion Table och deras geolocation skapas ett layer i vald färg över den lng och lat man bestämt. */
        if (user == correct && user != null)
        {
        document.getElementById("newGame").style.background='green';
        document.getElementById("newGame").innerHTML = "Next round!";

        var right = new google.maps.FusionTablesLayer({
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
        right.setMap(map);

        /*i är en variabel som räknar poängen.*/
        i++;

        $("#clue_box").text("Thats right! It's " + country_name);

        /*När man valt att gå vidare till nästa land så klickar man på "new game" knappen, och då körs denna kod igenom.
        Koden kallar på remover som är en funktion lite längre ner. */
        $('#newGame').off("click").on("click", function() {
            remover(right)
        });

        }
        /*Om användaren inte har rätt, så lyser rätt svar i grönt och det gissade landet blir rött. Poängen nollställs också*/
        else if (user != null && correct != null){

        i = 0;
        wrong = new google.maps.FusionTablesLayer({
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

        wrong.setMap(map);
        right = new google.maps.FusionTablesLayer({
                  query: {
                    select: 'geometry',
                    from: '1tPQ9xXwgQU0M_1fYK6AvFqcgf--31LOWnAy0RVN6',
                    where: "ISO_2DIGIT = '" + correct +"'"
                  },
        });
        right.setMap(map);
        $("#clue_box").text("The right answer is " + country_name);


        document.getElementById("newGame").style.background='red';
        document.getElementById("newGame").innerHTML = "Retry?";

        }
        guessButton.disabled= true;

        $("#score").text(i + " points");

        // http://stackoverflow.com/questions/14969960/jquery-click-events-firing-multiple-times
$('#newGame').off("click").on("click", function() {
    remover(wrong,right)
});

   

    if (undefined != user && user.length > 2)
        /*Då geolocation inte är särskilt exakt, så har jag denna kod som backup*/
    {
        window.alert("Sorry, the geodata isn't very accurate. Please make a new guess in the same country")
    }
}
}
        /*Denna kod tar bort markören och resettar spelets lager och knappar. Den kallar även på randomizer som slumpar
        fram ett nytt land för vidare spelning.*/
        function remover(wrong, right)
        {
       $("#newGame").hide();
       $("#guessButton").show();
       if (wrong != null)
       {
        wrong.setMap(null)
        right.setMap(null)
        }
        else{
            right.setMap(null)
        }
        correct_answer = null;

        randomizer()

    }