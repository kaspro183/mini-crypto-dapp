// Adresse du contrat APRÈS déploiement (optionnel pour l’instant)
const CONTRACT_ADDRESS = "0xYourDeployedAddress"; // TODO

// ABI minimale du contrat
const CONTRACT_ABI = [
  { "type":"constructor", "inputs":[{"name":"initialGreeting","type":"string"}] },
  { "type":"function", "name":"setGreeting", "stateMutability":"nonpayable",
    "inputs":[{"name":"newGreeting","type":"string"}], "outputs":[] },
  { "type":"function", "name":"getGreeting", "stateMutability":"view",
    "inputs":[], "outputs":[{"type":"string"}] },
  { "type":"event", "name":"GreetingChanged",
    "inputs":[
      {"name":"sender","type":"address","indexed":true},
      {"name":"newGreeting","type":"string","indexed":false}
    ],
    "anonymous":false
  }
];

let provider, signer, contract;

const $ = (id) => document.getElementById(id);

async function connect() {
  if (!window.ethereum) {
    alert("Installe MetaMask pour continuer.");
    return;
  }
  provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  const network = await provider.getNetwork();
  $("account").textContent = `Compte: ${accounts[0]}`;
  $("network").textContent = `Réseau: ${network.name} (${network.chainId})`;

  const block = await provider.getBlockNumber();
  $("block").textContent = `Block #: ${block}`;

  if (CONTRACT_ADDRESS && CONTRACT_ADDRESS.startsWith("0x") && CONTRACT_ADDRESS.length === 42) {
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
}

async function readGreeting() {
  if (!contract) return alert("Pas d'adresse de contrat. (Optionnel)");
  const g = await contract.getGreeting();
  $("currentGreeting").textContent = `Greeting: ${g}`;
}

async function writeGreeting() {
  if (!contract) return alert("Pas d'adresse de contrat. (Optionnel)");
  const val = $("greetInput").value || "Hello!";
  const tx = await contract.setGreeting(val);
  $("currentGreeting").textContent = "Tx envoyée. Attente de confirmation...";
  await tx.wait();
  $("currentGreeting").textContent = "Tx confirmée ✅";
}

$("connectBtn").addEventListener("click", connect);
$("readBtn").addEventListener("click", readGreeting);
$("writeBtn").addEventListener("click", writeGreeting);
