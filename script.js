function showFederal() {
    document.getElementById('section-title').innerText = 'Federal Criminal Code';
    document.getElementById('federal-content').style.display = 'flex';
    document.getElementById('municipal-content').style.display = 'none';
}

function showMunicipal() {
    document.getElementById('section-title').innerText = 'Municipal Criminal Code';
    document.getElementById('federal-content').style.display = 'none';
    document.getElementById('municipal-content').style.display = 'flex';
}

function showFRCP() {
    document.getElementById('section-title').innerText = 'Federal Rules of Civil Procedure';
    document.getElementById('frcp-content').style.display = 'flex';
    document.getElementById('frcmp-content').style.display = 'none';
}

function showFRCMP() {
    document.getElementById('section-title').innerText = 'Federal Rules of Criminal Procedure';
    document.getElementById('frcp-content').style.display = 'none';
    document.getElementById('frcmp-content').style.display = 'flex';
}

function showConstitution() {
    document.getElementById('section-title').innerText = 'Constitution';
    document.getElementById('constitution-content').style.display = 'flex';
    document.getElementById('amendment-content').style.display = 'none';
}

function showAmendments() {
    document.getElementById('section-title').innerText = 'Constitutional Amendments';
    document.getElementById('constitution-content').style.display = 'none';
    document.getElementById('amendment-content').style.display = 'flex';
}

function showDefinition() {
    document.getElementById('section-title').innerText = 'Definitions';
    document.getElementById('definition-content').style.display = 'flex';
    document.getElementById('file-content').style.display = 'none';
}

function showFile() {
    document.getElementById('section-title').innerText = 'Files';
    document.getElementById('definition-content').style.display = 'none';
    document.getElementById('file-content').style.display = 'flex';
}
