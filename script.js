function showFederal() {
    document.getElementById('section-title').innerText = 'Federal';
    document.getElementById('federal-content').style.display = 'flex';
    document.getElementById('municipal-content').style.display = 'none';
}

function showMunicipal() {
    document.getElementById('section-title').innerText = 'Municipal';
    document.getElementById('federal-content').style.display = 'none';
    document.getElementById('municipal-content').style.display = 'flex';
}

function showFRCP() {
    document.getElementById('section-title').innerText = 'FRCP';
    document.getElementById('frcp-content').style.display = 'flex';
    document.getElementById('frcmp-content').style.display = 'none';
}

function showFRCMP() {
    document.getElementById('section-title').innerText = 'FRCMP';
    document.getElementById('frcmp-content').style.display = 'flex';
    document.getElementById('frcp-content').style.display = 'none';
}