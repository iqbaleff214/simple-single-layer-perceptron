// HTML element
const _datasetTable = document.querySelector("tbody.tbody-dataset");
const _trainingTable = document.querySelector("tbody.tbody-training");
const _testingTable = document.querySelector("tbody.tbody-testing");
const _x1 = document.querySelector("#input-x1");
const _x2 = document.querySelector("#input-x2");
const _x3 = document.querySelector("#input-x3");
const _x4 = document.querySelector("#input-x4");
const _y = document.querySelector("#input-t");
const _x1Test = document.querySelector("#test-x1");
const _x2Test = document.querySelector("#test-x2");
const _x3Test = document.querySelector("#test-x3");
const _x4Test = document.querySelector("#test-x4");
const _yTest = document.querySelector("#test-t");

// Constant
const itemStorage = "dataset_jst4";

// Helper function
const error = (prediction, trueValue) => (prediction - trueValue) ** 2;
const getDataset = () => JSON.parse(localStorage.getItem(itemStorage));
const setRowDataset = () => {
  return {
    input: [
      parseFloat(_x1.value),
      parseFloat(_x2.value),
      parseFloat(_x3.value),
      parseFloat(_x4.value),
    ],
    output: parseFloat(_y.value),
  };
};
const storeDataset = (obj) => {
  _x1.value = _x2.value = _x3.value = _x4.value = "";
  dataset.push(obj);
  localStorage.setItem(itemStorage, JSON.stringify(dataset));
  location.reload();
};
const setDatasetJSON = () => {
  dataset =
    document.querySelector('input[name="defaultDataset"]:checked').value == "10"
      ? data10
      : data100;
  localStorage.setItem(itemStorage, JSON.stringify(dataset));
};
const resetDataset = () => {
  setDatasetJSON();
  location.reload();
};
const generateTableDataset = () => {
  row = "";
  let no = 1;
  dataset.forEach((element) => {
    row += `
              <tr>
                <td>${no++}</td>
                <td>${element.input[0]}cm</td>
                <td>${element.input[1]}cm</td>
                <td>${element.input[2]}cm</td>
                <td>${element.input[3]}cm</td>
                <td>${
                  element.output ? "Iris-virginica (1)" : "Iris-versicolor (0)"
                }</td>
              </tr>
        `;
  });
  return row;
};
const is_contains = (el, className) => el.target.classList.contains(className);
const sigmoid = (val) => 1 / (1 + Math.exp(-val));
const inputNotNull = () =>
  _x1.value !== "" && _x2.value !== "" && _x3.value !== "" && _x4.value !== "";
const inputNotNullTesting = () =>
  _x1Test.value !== "" &&
  _x2Test.value !== "" &&
  _x3Test.value !== "" &&
  _x4Test.value !== "";

// Retrieve dataset from Storage if available
if (localStorage.getItem(itemStorage)) dataset = getDataset();
else setDatasetJSON();

const ALPHA = 0.1;
const EPOCH = 10;
let weights = [0.5, 0.5, 0.5, 0.5];
let dWeights = weights;
let threshold = 0.5;
let dThreshold = threshold;
let smallestError = 9;

let dataTesting = 0;

let trained = false;

document.addEventListener("click", (e) => {
  if (is_contains(e, "input-simpan"))
    if (inputNotNull()) storeDataset(setRowDataset());

  if (is_contains(e, "dataset-reset"))
    if (confirm("Yakin ingin mereset dataset?")) resetDataset();

  if (is_contains(e, "training-tab")) if (!trained) training();

  if (is_contains(e, "test-simpan")) if (inputNotNullTesting()) testing();
});

// Perceptron
function perceptron() {
  let row = "";
  for (const i of Array(EPOCH).keys()) {
    let errors = 0;
    console.log(`Epoch: ${i + 1}`);
    for (const j of dataset.keys()) {
      const currentData = dataset[j];
      row += "<tr>";
      row += j == 0 ? `<td rowspan="${dataset.length}">${i + 1}</td>` : ``;
      row += `<td>${j + 1}</td>`;
      let sum = threshold;
      // console.log(`Bias sebelum: ${sum}`);
      for (let k = 0; k < weights.length; k++)
        sum = sum + currentData.input[k] * weights[k];
      // console.log(`data ke-${j + 1}: ${sum.toPrecision(6)}`);
      row += `<td>${sum.toPrecision(6)}</td>`;
      const activate = sigmoid(sum);
      // console.log(`Sigmoid: ${activate.toPrecision(5)}`);
      row += `<td>${activate.toPrecision(5)}</td>`;
      row += `<td>${currentData.output}</td>`;
      const err = error(currentData.output, activate);
      errors += err;
      // console.log(`Error: ${err.toPrecision(5)}`);
      row += `<td>${err.toFixed(5)}</td>`;
      smallestError = smallestError > err ? err.toFixed(9) : smallestError;
      const deltaThreshold =
        -2 * (currentData.output - activate) * activate * (1 - activate);
      for (let k = 0; k < weights.length; k++) {
        const deltaWheight = deltaThreshold * currentData.input[k];
        // console.log(`delta x${k + 1}: ${deltaWheight.toFixed(5)}`);
        weights[k] = weights[k] - ALPHA * deltaWheight;
      }
      threshold = threshold - ALPHA * deltaThreshold;
      if (smallestError == err) {
        dWeights = weights;
        dThreshold = threshold;
      }
      // console.log(`delta bias: ${deltaThreshold.toFixed(5)}`);
      row += "</tr>";
    }
    const epochError = errors / dataset.length;
    console.log(`Epoch error: ${errors / dataset.length}`);
  }
  trained = true;
  setTimeout(() => {
    _trainingTable.innerHTML = row;
  }, 1500);
}

function training() {
  document.querySelector(".span-alpha").innerHTML = ALPHA;
  document.querySelector(".span-jml-data").innerHTML = dataset.length;
  document.querySelector(".span-epoch").innerHTML = EPOCH;
  document.querySelector(".span-w1-old").innerHTML = weights[0];
  document.querySelector(".span-w2-old").innerHTML = weights[1];
  document.querySelector(".span-w3-old").innerHTML = weights[2];
  document.querySelector(".span-w4-old").innerHTML = weights[3];
  document.querySelector(".span-bias-old").innerHTML = threshold;
  perceptron();
  document.querySelector(".span-w1-new").innerHTML = weights[0].toFixed(5);
  document.querySelector(".span-w2-new").innerHTML = weights[1].toFixed(5);
  document.querySelector(".span-w3-new").innerHTML = weights[2].toFixed(5);
  document.querySelector(".span-w4-new").innerHTML = weights[3].toFixed(5);
  document.querySelector(".span-bias-new").innerHTML = threshold.toFixed(5);
}

function testing() {
  dataTesting++;
  let row = "";
  row += "<tr>";
  row += `<td>${dataTesting}</td>`;
  row += `<td>${_x1Test.value}</td>`;
  row += `<td>${_x2Test.value}</td>`;
  row += `<td>${_x3Test.value}</td>`;
  row += `<td>${_x4Test.value}</td>`;
  row += `<td>${_yTest.value == 1 ? "Iris-virginica" : "Iris-versicolor"}</td>`;
  row += `<td>${_yTest.value}</td>`;
  const sigma =
    _x1Test.value * weights[0] +
    _x2Test.value * weights[1] +
    _x3Test.value * weights[2] +
    _x4Test.value * weights[3] +
    threshold;
  const prediksi = sigmoid(sigma);
  row += `<td>${prediksi}</td>`;
  row += "</tr>";
  _testingTable.innerHTML += row;
  _x1Test.value = _x2Test.value = _x3Test.value = _x4Test.value = "";
}

_datasetTable.innerHTML = generateTableDataset();
datatable();
