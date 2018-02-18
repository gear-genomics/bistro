/* global c3 */

$('#mainTab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})

var resultLink = document.getElementById('link-results')
var resultTab = document.getElementById('result-tab')

var submitButton = document.getElementById('btn-submit')
submitButton.addEventListener('click', function () {
    resultLink.click()
    run()
})

var exampleButton = document.getElementById('btn-example')
exampleButton.addEventListener('click', function () {
    loadExample()
    setTimeout(function () {
        resultLink.click()
    }, 1000)
})

var seqsInput = document.getElementById('seqs')

var spinnerHtml = '<i class="fas fa-spinner fa-2x spinner"></i>'

function run() {
    resultTab.innerHTML = spinnerHtml
    var seqs = seqsInput.value
        .split('\n')
        .filter(function (line) {
            return line !== ""
        })

    if (seqs.length === 0) {
        displayError('no sequences provided')
        return
    }

    lastLen = null
    for (var i = 0; i < seqs.length; i += 1) {
        var seq = seqs[i]
        if (i > 0 && lastLen != seq.length) {
            displayError('sequences do not have the same length')
            return
        }
        lastLen = seq.length
        if (!isDna(seq)) {
            displayError('sequences contain characters other than ACGTacgt')
            return
        }
    }

    displayResults(seqs)
}

function isDna(seq) {
    dnaAlphaLower = { 'A': true, 'C': true, 'G': true, 'T': true }
    for (var i = 0; i < seq.length; i += 1) {
        base = seq[i].toUpperCase()
        if (!dnaAlphaLower.hasOwnProperty(base)) {
            return false
        }
    }
    return true
}

function displayResults(seqs) {
    var frequencies = getFrequencies(seqs)
    c3.generate({
        bindto: '#result-tab',
        data: {
            columns: [
                ['A'].concat(frequencies.A),
                ['C'].concat(frequencies.C),
                ['G'].concat(frequencies.G),
                ['T'].concat(frequencies.T)
            ],
            type: 'bar',
            groups: [
                ['A', 'C', 'G', 'T']
            ]
        },
        color: {
            pattern: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3']
        },
        axis: {
            y: {
                label: {
                    text: 'Frequency',
                    position: 'outer-top'
                },
                padding: 0
            },
            x: {
                label: {
                    text: 'Position',
                    position: 'outer-right'
                },
                tick: {
                    format: function (x) { return x + 1 }
                }
            }
        }
    })
}

function getFrequencies(sequences) {
    var frequencies = {
        A: [],
        C: [],
        G: [],
        T: []
    }
    var len = sequences[0].length
    var num = sequences.length
    for (let i = 0; i < len; i += 1) {
        var counts = {
            A: 0,
            C: 0,
            G: 0,
            T: 0
        }
        for (let j = 0; j < num; j += 1) {
            var seq = sequences[j]
            counts[seq[i].toUpperCase()] += 1
        }
        frequencies.A.push(counts.A / num)
        frequencies.C.push(counts.C / num)
        frequencies.G.push(counts.G / num)
        frequencies.T.push(counts.T / num)
    }
    return frequencies
}

var exampleSeqs = [
    'GATAGCTCAG',
    'TGCAATGGTC',
    'TTATACCAGG',
    'CAGCAGTTTA',
    'ACTCTGAGGC',
    'ACAGGACTCT'
]

function loadExample() {
    seqsInput.value = exampleSeqs.join('\n')
    displayResults(exampleSeqs)
}

function displayError(message) {
    resultTab.innerHTML = '<p class="text-danger">Error: ' + message + '</p>'
}
