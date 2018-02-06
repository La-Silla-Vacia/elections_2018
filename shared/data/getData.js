function getData(callback) {
  let dataExists,
    interactiveData;

  // Look if there is a global variable declared with specific data for this infographic
  try {
    if (tarjetones_2018_data) {
      dataExists = true;
      interactiveData = tarjetones_2018_data;
    }
  } catch (e) {
    dataExists = false;
  }

  // If the variable exists, and has a dataUri key, download the data
  if (dataExists) {
    if (interactiveData.dataUri) {
      fetchData(interactiveData.dataUri, (data) => {
        const formattedData = formatData(data);
      if (callback) callback(formattedData);
    });
    }
  } else {
    callback([]);
  }
}

function formatData(data) {
  return data.map((item, key) => {
    const pattern = /^((http|https|ftp):\/\/)/;
  let fotoUrl = item.AQ;
  if(!pattern.test(fotoUrl)) {
    fotoUrl = `https://lsv-archivo.imgix.net/candidatoscongreso2018/${(item.AQ) ? item.AQ : '60.jpg'}`
  }

  return {
    id: 'p' + key,
    apellido1: item.A,
    apellido2: item.B,
    nombres: item.C,
    name: `${item.C} ${item.A} ${item.B}`,
    perfilDeQuienEsQuien: item.G,
    twitter: item.H,
    votosMasRecientes: item.K,
    enQueEleccionSacoLosVotosMasRecientes: item.L,
    birthyear: item.M,
    camara: item.N ? item.N.trim() : item.N,
    genero: item.O ? item.O.trim() : item.O,
    partido: item.Q ? item.Q.trim() : item.Q,
    numeroEnElTarjeton: item.R,
    posicionIz_der1A100: item.S,
    departamento: item.D ? item.D.trim() : item.D,
    profesionUOficio: item.U,
    nivelDeEstudios: item.V,
    sectorDelQueViene: item.W ? item.W.trim() : item.W,
    expertoEn: item.X ? item.X.trim() : item.X,
    tieneInvestigacionesPenales: item.Y,
    haSidoCondenado: item.Z,
    haSidoDestituido: item.AA,
    haSidoCongresista: item.AB,
    periodosComoCongresista: item.AC,
    haSidoGobernador: item.AD,
    haSidoDiputado: item.AE,
    haSidoAlcalde: item.AF,
    haSidoConcejal: item.AG,
    haSidoAntesCandidatoACargosDeEleccionPopular: item.AH,
    haEstadoEnMasDeDosPartidos: item.AI,
    haOcupadoUnCargoPublico: item.AJ,
    herederoDeVotosDeCondenados: item.AK,
    herederoDeVotosDeInvestigados: item.AL,
    cuestionado: item.AM,
    tieneFamiliarEnLaPolitica: item.AN,
    esHerederoPolitico: item.AO,
    perfilito: item.AP,
    foto: fotoUrl,
    buscaReeleccion: item.AR,
    saltoCamaraSenado: item.AS,
    precandidatoQueApoyaba: item.AT,
    candidatoPresidencialQueApoya: item.AU,
    banderas: [item.AV, item.AW, item.AX],
    esAfro: item.AY,
    minoria: item.BH,
    grupo: item.BI
  }
});
}

function fetchData(uri, callback) {
  fetch(uri)
    .then((response) => {
    return response.json()
  })
.then((json) => {
    if (callback) callback(json);
})
.catch((ex) => {
    console.log('parsing failed', ex)
})
}

export default getData;