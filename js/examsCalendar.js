mainTable = document.querySelector("#form2 > table:nth-child(2) > tbody:nth-child(1)").children;
parseMainTable(mainTable);

var newCol = document.createElement("td");
newCol.className = "table_topcol";

var newColText = document.createElement("font");
newColText.innerHTML = "Calen<br>dário";
newColText.setAttribute("color", "white");

newCol.appendChild(newColText);
document.querySelector("#form2 > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(2)").appendChild(newCol);

function parseMainTable(table){
    var i;
    var row;
    //Cycle through rows
    for(i=2;i<table.length-2;i++){
        row = table[i].children;
        parseRow(row);
    }
}

function parseRow(row){
    var tempDate, tempHours;
    var datestart, dateend;
    var disciplina, data, obs, sala, epoca;
    var link;

    tempD = row[2].innerText.replace(" DE ", " ").replace(" E "," ").replace(" À "," ").replace(" AOS "," ").replace(" PARA "," ").replace(" NAS "," ").replace(" A "," ").replace(" EM "," ").split(/[\s-]+/);
    disciplina = "";
    for (var j = 0; j < tempD.length; j++){
        //Check if 'I' is a letter or a roman number
        if (tempD[j][0] == "I" && tempD[j][1] == "I")
            //If number, write the whole number
            disciplina = disciplina + tempD[j];
        else
            //If not, write just the first letter
        	disciplina = disciplina + tempD[j][0];
    }
    obs = row[7].innerText;
    sala = row[4].innerText;
    if (row[6].innerText == "DZ")
        epoca = "Época Especial";
    else if (row[6].innerText == "FN")
        epoca = "Final";
    else if (row[6].innerText == "RE")
        epoca = "Recurso";
    else 
        epoca = "";
    tempDate = row[0].innerText.split("/");
    tempHours = row[3].innerText.split(":")
    data = new Date();
    data.setDate(tempDate[0]);
    data.setMonth(tempDate[1]-1);
    data.setFullYear(tempDate[2]);
    data.setHours(tempHours[0],tempHours[1],0);

    //Create link
    link = new URL("https://www.google.com/calendar/render");
    link.searchParams.append("action", "TEMPLATE");
    link.searchParams.append("text", "[" + disciplina + "] Exame " + epoca);
    datestart = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
    data.setHours(data.getHours() + 2);
    dateend = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
    link.searchParams.append("dates", datestart + "/" + dateend)
    link.searchParams.append("details", obs);
    link.searchParams.append("location", sala);
    link.searchParams.append("sf", "true");
    link.searchParams.append("output", "xml");

    //Insert link to create event in table
    var newNode = document.createElement("td");
    var linkElement = document.createElement("a");
    var imgElement = document.createElement("img");

    linkElement.setAttribute("href", link);
    linkElement.setAttribute("target", "_blank");

    imgElement.setAttribute("src", chrome.runtime.getURL("img/calendar.png"));
    imgElement.setAttribute("height", "30");
    imgElement.setAttribute("width", "30");
    imgElement.setAttribute("alt", "Google Calendar");
    imgElement.setAttribute("title", "Adicionar ao calendário");

    linkElement.appendChild(imgElement);
    newNode.appendChild(linkElement);

    row[0].parentElement.appendChild(newNode);
    
}

// Sort exams by date correctly
var exams = Array.from(document.querySelectorAll("form#form2 > table > tbody > tr[class^='table_cell_']"));

exams.sort(function(a, b) {
    const [dayA, monthA, yearA] = a.querySelector('td:nth-child(1)').innerText.split('/');
    const [dayB, monthB, yearB] = b.querySelector('td:nth-child(1)').innerText.split('/');

    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

    return dateA - dateB;
});

var examsTable = document.querySelector("form#form2 > table > tbody");

exams.forEach(function(exam) {
    examsTable.insertBefore(exam, examsTable.rows[examsTable.rows.length - 2]);
});
