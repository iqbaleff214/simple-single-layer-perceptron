// HTML element
const _datasetTable = document.querySelector("tbody.tbody-dataset");
const _trainingTable = document.querySelector("tbody.tbody-training");
const _x1 = document.querySelector("#input-x1");
const _x2 = document.querySelector("#input-x2");
const _x3 = document.querySelector("#input-x3");
const _x4 = document.querySelector("#input-x4");
const _y = document.querySelector("#input-t");

// Constant
const itemStorage = "dataset_jst4";

// Helper function
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
  dataset = data;
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
                  element.output ? "Iris-versicolor (1)" : "Iris-virginica (0)"
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

// Retrieve dataset from Storage if available
if (localStorage.getItem(itemStorage)) dataset = getDataset();
else setDatasetJSON();

const ALPHA = 0.002;
let weights = [0.5, 0.5, 0.5, 0.5];
let dWeights = [];
let threshold = 0.5;
let dThreshold;

document.addEventListener("click", (e) => {
  if (is_contains(e, "input-simpan"))
    if (inputNotNull()) storeDataset(setRowDataset());

  if (is_contains(e, "dataset-reset"))
    if (confirm("Yakin ingin mereset dataset?")) resetDataset();
});

_datasetTable.innerHTML = generateTableDataset();
datatable();