$('#mainTab a').on('click', function (e) {
  e.preventDefault()
  $(this).tab('show')
})

const resultLink = document.getElementById('link-results')
const notification = document.getElementById('notification')
const chartId = 'chart'
const chart = document.getElementById(chartId)

const submitButton = document.getElementById('btn-submit')
submitButton.addEventListener('click', function () {
  resultLink.click()
  run()
})

const exampleButton = document.getElementById('btn-example')
exampleButton.addEventListener('click', loadExample)

const seqsInput = document.getElementById('seqs')
const spinnerHtml = '<i class="fas fa-spinner fa-2x spinner"></i>'

function run () {
  notification.innerHTML = spinnerHtml
  chart.innerHTML = ''
  const seqs = seqsInput.value
    .split('\n')
    .filter(function (line) {
      return line !== ""
    })

  if (seqs.length === 0) {
    displayError('no sequences provided')
    return
  }

  let lastLen = null
  for (let i = 0; i < seqs.length; i += 1) {
    const seq = seqs[i]
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

function isDna (seq) {
  const alphabet = { 'A': true, 'C': true, 'G': true, 'T': true }
  for (let i = 0; i < seq.length; i += 1) {
    const base = seq[i].toUpperCase()
    if (!alphabet.hasOwnProperty(base)) {
      return false
    }
  }
  return true
}

function displayResults (seqs) {
  baseFrequencies = computeBaseFrequencies(seqs)
  notification.innerHTML = ''
  plotFrequencies(baseFrequencies, chartId)
}

const exampleSeqs = [
  'GATAGCTCAG',
  'TGCAATGGTC',
  'TTATACCAGG',
  'CAGCAGTTTA',
  'ACTCTGAGGC',
  'ACAGGACTCT'
]

function loadExample () {
  seqsInput.value = exampleSeqs.join('\n')
}

function displayError (message) {
  notification.innerHTML = '<p class="text-danger">Error: ' + message + '</p>'
}

function computeBaseFrequencies (sequences) {
  const frequencies = {
    A: [],
    C: [],
    G: [],
    T: []
  }
  const len = sequences[0].length
  const num = sequences.length
  for (let i = 0; i < len; i += 1) {
    const counts = {
      A: 0,
      C: 0,
      G: 0,
      T: 0
    }
    for (let j = 0; j < num; j += 1) {
      const seq = sequences[j]
      counts[seq[i]] += 1
    }
    frequencies.A.push(counts.A / num)
    frequencies.C.push(counts.C / num)
    frequencies.G.push(counts.G / num)
    frequencies.T.push(counts.T / num)
  }
  return frequencies
}

function plotFrequencies (frequencies, containerId) {
  const data = []
  const bases = 'ACGT'
  for (let i = 0; i < bases.length; i += 1) {
    const base = bases[i]
    data.push({
      y: frequencies[base],
      x: frequencies[base].map(function (_, i) {
        return i + 1
      }),
      name: base,
      type: 'bar'
    })
  }

  const layout = {
    barmode: 'stack',
    title: 'Per-position base distribution',
    xaxis: {
      title: 'Position',
      tickvals: data[0].x
    },
    yaxis: {
      title: 'Frequency'
    }
  }

  Plotly.newPlot(containerId, data, layout)
}
