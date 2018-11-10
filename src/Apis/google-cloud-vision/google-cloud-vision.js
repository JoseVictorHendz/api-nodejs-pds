const express = require('express')
const Vision = require('@google-cloud/vision');

function createClient() {
    const client = new Vision.ImageAnnotatorClient({
        keyFilename: './src/Apis/google-cloud-vision/keyApi.json'
    })
    return client   
}
 
function imageLocation(imageReference) {
    return "./src/Apis/google-cloud-vision/images/"+imageReference+".png" //palavra.jpg"
}

exports.labelDetection = (async (imageReference) => {
    const client = createClient()

    let data = []

    await client
        .labelDetection(imageLocation(imageReference))
        .then(results => {
            const labels = results[0].labelAnnotations;
            console.log("--------3-----------")

            labels.forEach(label => data.push(label.description))
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    return data
});

exports.imageProperties = (async () => {
    const client = createClient()

    let data = []

    await client
        .imageProperties(imageLocation())
        .then(results => {
            const properties = results[0].imagePropertiesAnnotation;
            const colors = properties.dominantColors.colors;

            colors.forEach(color => data.push(color.color));
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    return data
})

exports.imageDocumentTextDetection = (async () => {
    const client = createClient()

    let data = []

    await client
        .documentTextDetection(imageLocation())
        .then(results => {
            const fullTextAnnotation = results[0].fullTextAnnotation;

            data.push({'text': fullTextAnnotation.text, 'language': fullTextAnnotation.pages[0].property.detectedLanguages[0].languageCode});
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    return data
})