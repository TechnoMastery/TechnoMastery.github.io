const websiteMod = JSON.parse(localStorage.getItem('websiteMod'));
const userDiv = document.getElementById('user');
const user = websiteMod.user;

function usernameSet() {
    const username = prompt("Please tell us your username :", "guest");
    if(username == null || username == "") {
        alert("Username incorrect.");
    } else {
        const newWbesiteMod = {
            user: username
        }
        localStorage.setItem("websiteMod", JSON.stringify(newWbesiteMod));
        location.reload();
    }
}

if(user == "dev") {
console.log("dev mod enabled !")
    userDiv.innerHTML = `
        <a href="pages/dev"><button class="buttons button-blue">DEV only</button></a><br>
    `
}

// pane for user and teams
if(user == "Minheur") {
    userDiv.innerHTML = `
        <a href="pages/encode"><button class="buttons button-blue", disabled>Encoding (OFF)</button></a><br>
        <a href="pages/profiles/Min_heur2000"><button class="buttons button-red">Your profile</button></a><br>
        <a href="pages/techno-smp/teams/minheur-corp"><button class="buttons button-red">Your TechnoSMP team</button></a><br>
    `
}
if(user == "Xako") {
    userDiv.innerHTML = `
        <a href="pages/encode"><button class="buttons button-blue", disabled>Encoding (OFF)</button></a><br>
        <a href="pages/profiles/XaQorix"><button class="buttons button-green">Your profile</button></a><br>
        <a href="pages/techno-smp/teams/xakos-industries"><button class="buttons button-green">Your TechnoSMP team</button></a><br>
    `
}
if(user == "Exio2fk") {
    userDiv.innerHTML = `
        <a href="pages/profiles/exio2fk"><button class="buttons button-green">Your profile</button></a><br>
        <a href="pages/techno-smp/teams/xakos-industries"><button class="buttons button-green">Your TechnoSMP team</button></a><br>
    `
}
if(user == "Polimo") {
    userDiv.innerHTML = `
        <a href="pages/profiles/polimo"><button class="buttons button-darkblue">Your profile</button></a><br>
        <button class="buttons button-darkslategray" disabled>No TechnoSMP team</button><br>
    `
}
if(user == "Catoutou") {
    userDiv.innerHTML = `
        <a href="pages/profiles/catoutou"><button class="buttons button-purple">Your profile</button></a><br>
        <a href="pages/techno-smp/teams/no-benny-le-retour"><button class="buttons button-blue">Your TechnoSMP team</button></a><br>
    `
}
if(user == "Loulougaim") {
    userDiv.innerHTML = `
        <a href="pages/profiles/loulou"><button class="buttons button-purple">Your profile</button></a><br>
        <button class="buttons button-darkslategray" disabled>No TechnoSMP team</button><br>
    `
}
if(user == "Ezinox") {
    userDiv.innerHTML = `
        <a href="pages/profiles/Ezinox"><button class="buttons button-purple">Your profile</button></a><br>
        <button class="buttons button-darkslategray" disabled>No TechnoSMP team</button><br>
    `
}
if(user == "Benny232") {
    userDiv.innerHTML = `
        <a href="pages/profiles/benny232"><button class="buttons button-purple">Your profile</button></a><br>
        <button class="buttons button-darkslategray" disabled>No TechnoSMP team</button><br>
    `
}
if(user == "Pro__Craft") {
    userDiv.innerHTML = `
        <button class="buttons button-darkslategray" disabled>No profile</button><br>
        <a href="pages/techno-smp/teams/no-benny-le-retour"><button class="buttons button-blue">Your TechnoSMP team</button></a><br>
    `
}
