require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const cors = require('cors');


const app = express();

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOLAB_URI,{useNewUrlParser: true});
//if using local use 'mongodb://localhost/patientdb'


const patientSchema = new mongoose.Schema({
  name: String,
  contact: String,
  address: String,
  pincode: String,
});

const Patient = mongoose.model('Patient', patientSchema);

// app.get('/',(req,res)=>{
//   Patient.find({},(pat)=>{
//     console.log(pat)
//   })
// })

app.get('/', async (req, res) => {
  const patients = await Patient.find();
  res.render('index',{patients})
});

app.get('/api/patients', async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

app.post('/api/patients', async (req, res) => {
  const patient = new Patient({
    name: req.body.name,
    contact: req.body.contact,
    address: req.body.address,
    pincode: req.body.pincode,
  });
  await patient.save();
  res.json(patient);
});

app.put('/api/patients/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  patient.name = req.body.name;
  patient.contact = req.body.contact;
  patient.address = req.body.address;
  patient.pincode = req.body.pincode;
  await patient.save();
  res.json(patient);
});

app.delete('/api/patients/:id', async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  res.json(patient);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
