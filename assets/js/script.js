// inisialisasi element
const _modalBody = document.querySelector(".modal-body");
const _btnTraining = document.querySelector(".btn-data-training");
const _btnArchitec = document.querySelector(".btn-arsitektur");
const _containerMain = document.querySelector("#datatest-result");

let trainingData = [];

const convertValue = (value, multiply = true) =>
  multiply ? value * 100 : value / 100;
const validate = (value) => value >= 0 && value <= 100;
const storeDataset = (obj) => {
  trainingData.push(obj);
  localStorage.setItem("dataset", JSON.stringify(trainingData));
  renderDataset();
};
const getDataset = () => JSON.parse(localStorage.getItem("dataset"));

if (localStorage.getItem("dataset")) {
  trainingData = getDataset();
} else {
  // inisialisasi training data
  trainingData = [
    {
      input: { taste: 0.76, price: 0.8, place: 0.65 },
      output: { good: 1 },
    },
    {
      input: { taste: 0.6, price: 0.8, place: 0.85 },
      output: { good: 1 },
    },
    {
      input: { taste: 0.6, price: 0.4, place: 0.35 },
      output: { bad: 1 },
    },
    {
      input: { taste: 0.9, price: 0.36, place: 0.9 },
      output: { good: 1 },
    },
    {
      input: { taste: 0.84, price: 0.86, place: 0.65 },
      output: { good: 1 },
    },
    {
      input: { taste: 0.45, price: 0.96, place: 0.55 },
      output: { bad: 1 },
    },
  ];
  localStorage.setItem("dataset", JSON.stringify(trainingData));
}

// inisialisasi object JST dari BrianJS
const net = new NeuralNetwork(trainingData);

// functions to render
const renderDataset = () => {
  const formDataset = `
    <div class="row">
      <div class="col-md-3">
        <div class="form-group">
          <label for="tasteInputDataset">Rasa</label>
          <input
            type="number"
            min="0"
            max="100"
            class="form-control input-number"
            id="tasteInputDataset"
          />
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="priceInputDataset">Harga</label>
          <input
            type="number"
            min="0"
            max="100"
            class="form-control input-number"
            id="priceInputDataset"
          />
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="placeInputDataset">Tempat</label>
          <input
            type="number"
            min="0"
            max="100"
            class="form-control input-number"
            id="placeInputDataset"
          />
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
            <label for="resultInputDataset">Hasil</label>
            <select class="custom-select" id="resultInputDataset">
                <option value="1"><i class="lni-emoji-happy"></i> Senang</option>
                <option value="0"><i class="lni-emoji-sad"></i> Kecewa</option>
            </select>
        </div>
      </div>
      <div class="col-md-3">
        <div class="single-form form-group text-center mt-3">
          <button
            type="submit"
            class="main-btn btn-dataset-proses"
          >
            Tambahkan
          </button>
        </div>
      </div>
    </div>`;
  createModal({
    title: "Dataset",
    subtitle: "Ulasan Pengunjung Rumah Makan",
    body: formDataset + createTable(trainingData),
  });
};
const renderNetwork = () => {
  const renderConfig = {
    height: 300,
    width: 600,
    radius: 10,
    line: {
      width: 0.9,
      color: "black",
    },
    inputs: {
      color: "salmon",
      labels: ["rasa", "harga", "tempat"],
    },
    hidden: {
      color: "lightblue",
    },
    outputs: {
      color: "rgba(0, 128, 0, 0.5)",
    },
    recurrentLine: {
      color: "rgba(0, 128, 0, 0.5)",
    },
    fontSize: 14,
  };
  const imageToRender = net.getRendered(renderConfig);
  createModal({
    title: "Arsitektur Jaringan Saraf Tiruan",
    subtitle: "subtitle",
    body: imageToRender,
  });
};
const renderResult = (obj) => {
  let row = `
  <h3 class="pb-4">Hasil:</h3>
  <table class="table table-bordered mt-4">
    <tr>
      <th>
      <i class="lni-emoji-happy"></i>
      </th>
      <td>${obj.good}</td>
    </tr>
    <tr>
      <th>
      <i class="lni-emoji-sad"></i>
      </th>
      <td>${obj.bad}</td>
    </tr>
    <tr>
      <td colspan="2">
        <h4 class="my-4"><i class="lni-emoji-${
          obj.bad < obj.good ? 'happy"></i> Senang' : 'sad"></i> Kecewa'
        }</h4>
      </td>
    </tr>
  </table>
  `;
  _containerMain.innerHTML = row;
};
const createTable = (obj) => {
  let row = "";
  let i = 1;
  obj.forEach((el) => {
    row += `
                    <tr>
                        <th scope="row">${i++}</th>
                        <td>${parseInt(convertValue(el.input.taste))}</td>
                        <td>${parseInt(convertValue(el.input.price))}</td>
                        <td>${parseInt(convertValue(el.input.place))}</td>
                        <td>${
                          Math.round(el.output.good) ? "<i class='lni-emoji-happy'></i> Senang" : "<i class='lni-emoji-sad'></i> Kecewa"
                        }</td>
                    </tr>
        `;
  });
  return `  
        <div class="row mt-4">
            <div class="col">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Rasa</th>
                            <th scope="col">Harga</th>
                            <th scope="col">Tempat</th>
                            <th scope="col">Hasil</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${row}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};
const createModal = (obj) => {
  _modalBody.innerHTML = `  <div class="section-title text-center pb-20">
                <h5 class="sub-title mb-15">${obj.title}</h5>
                <h2 class="title">${obj.subtitle}</h2>
            </div>
            <div class="container justify-content-center">${obj.body}</div>`;
};

// event handler
_btnArchitec.addEventListener("click", function (e) {
  renderNetwork();
});

_btnTraining.addEventListener("click", function (e) {
  renderDataset();
});

document.addEventListener("keypress", function (e) {
  if (e.target.classList.contains("input-number")) {
    const code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-dataset-proses")) {
    //add dataset
    const valTaste = document.querySelector("#tasteInputDataset").value;
    const valPrice = document.querySelector("#priceInputDataset").value;
    const valPlace = document.querySelector("#placeInputDataset").value;
    const valResult = document.querySelector("#resultInputDataset").value;
    if (
      valTaste === "" ||
      valPrice === "" ||
      valPlace === "" ||
      valResult === ""
    ) {
      console.log("kosong");
    } else {
      if (validate(valTaste) && validate(valPlace) && validate(valPrice)) {
        let obj = {};
        obj.input = {
          taste: convertValue(parseInt(valTaste), false),
          price: convertValue(parseInt(valPrice), false),
          place: convertValue(parseInt(valPlace), false),
        };
        obj.output = valResult == 1 ? { good: 1 } : { bad: 1 };
        storeDataset(obj);
        net.trainData(true);
      } else {
        console.log("tidak valid");
      }
    }
  }

  if (e.target.classList.contains("btn-datatest-proses")) {
    const valTaste = document.querySelector("#tasteInput").value;
    const valPrice = document.querySelector("#priceInput").value;
    const valPlace = document.querySelector("#placeInput").value;
    if (valTaste === "" || valPrice === "" || valPlace === "") {
      console.log("kosong");
    } else {
      if (validate(valTaste) && validate(valPlace) && validate(valPrice)) {
        if (!net.isTrained) net.trainData(true);
        let obj = {
          taste: convertValue(parseInt(valTaste), false),
          price: convertValue(parseInt(valPrice), false),
          place: convertValue(parseInt(valPlace), false),
        };
        console.log(obj);
        const res = net.net.run(obj);
        renderResult(res);
      } else {
        console.log("tidak valid");
      }
    }
  }
});
