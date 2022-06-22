// --- --- --- imports
const { table } = require('console');
const fs = require('fs');
const jimp = require('jimp');
 
// --- --- --- classes
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
class TableIndex{
 constructor(table){
  // --- construct main index
  [this.indeces, this.maxIndecesArray] = this.createIndeces(table)
 }
  
 //iterate array by one
 addOne(){
  if(this.isAtEnd() === true){throw 'at end of index'};
  for (let index = 0; index < this.indeces.length; index++) {
   const atMaxIndex = this.indeces[this.indeces.length - 1 - index] === this.maxIndecesArray[this.maxIndecesArray.length - 1 - index]
   if(atMaxIndex){
    // dont do anything if at max index
   }else{
    // not at max
    // add one to count
    this.indeces[this.indeces.length - 1 - index] = this.indeces[this.indeces.length - 1 - index] + 1;
    // reset indeces afterwards to zero
    if(index > 0){
     for (let i = 0; i < index; i++) {
      this.indeces[this.indeces.length-1-i] = 0;
     }
    }
    // don't touch the rest
    break
   }
  }
 }
 // bool if at the end of the array or not
 isAtEnd(){
  for (let index = 0; index < this.indeces.length; index++) {
   const match = this.indeces[index] === this.maxIndecesArray[index];
   if(!match){
    return false
   }
  }
  console.log("at end");
  return true
 }
  
 createIndeces(table){
  const traitsArray = Object.keys(table);
  const numberOfTraits = traitsArray.length;
  let indeces = [];
  let maxIndeces = [];
  for (let index = 0; index < numberOfTraits; index++) {
   indeces.push(0);
   const maxIndex = table[traitsArray[index]].length;
   maxIndeces.push(maxIndex - 1);
  }
  return [indeces,maxIndeces];
 }
  
 getMaxNumber(){
  let max = 1;
  this.maxIndecesArray.forEach((val)=>{max = max * (val+1)});
  return max
 }
}
// --- --- --- functions
function createTable(pathToCSV){
  // convert file to array of strings by line
  const fileData = fs.readFileSync(pathToCSV, 'utf-8').split(/\r?\n/);
  // create returning object
  let returningObj = {};
  // create final object array
  for (let i = 0; i < fileData.length; i++) {
   let currentLine = fileData[i].split(',');
   for (let j = 0; j < currentLine.length; j++) {
    if(j===0){
     returningObj[currentLine[j]] = [];
    }else{
     returningObj[currentLine[0]].push(currentLine[j]);
    }
   }
  }
  return returningObj;
};
function writeMetadatas(table, templateObj){
  // create index from table
  let arrayIndex = new TableIndex(table);
  // create array of objects to write
  let objsToWriteArray = [];
  // create looping variables
  let count = 0;
  let maxCount = arrayIndex.getMaxNumber();
  // while index is not at end write metadatas
  while(count < maxCount){
   console.log(count, maxCount);
   // --- vars
   let countString = count.toString().padStart(4, '0');
   const traitNameArray = Object.keys(table);
   // --- clone template object
   let objToWrite = {...templateObj};
   // --- clear attribute object
   objToWrite.attributes = [];
   // --- fill in obj attributes
   for (let index = 0; index < traitNameArray.length; index++) {
    // create trait object
    let traitObj = {};
    // fill object
    traitObj["trait_type"] = traitNameArray[index];
    traitObj["value"] = table[traitNameArray[index]][arrayIndex.indeces[index]];
    // push object to attribute array
    objToWrite.attributes.push(traitObj);
   }
   // push objects to arrays
   objsToWriteArray.push(objToWrite)
   // iterate variables
   count++;
   try{arrayIndex.addOne();}catch(err){console.log(err)}
  }
  
  // shuffle array
  const shuffledArray = shuffle(objsToWriteArray);
  // write objects in array
  for (let index = 0; index < shuffledArray.length; index++) {
   // write ids 
   shuffledArray[index].name = shuffledArray[index].name + " #" + (index+1).toString().padStart(4,'0'); // * name must start with #0001
   shuffledArray[index].image = shuffledArray[index].image + (index).toString().padStart(4,'0') + ".png";
   // write object to folder
   let stringJson = JSON.stringify(shuffledArray[index]);
   fs.writeFileSync('./output/uneditedMetadata/'+index.toString(), stringJson);
  }
}
function generateImages(table, layerOrder){
  //--- vars
  let count = 0;
  const maxCount = (()=>{const i = new TableIndex(table); return i.getMaxNumber()})(); // 
  async function MakeImage(number){
    // --- read current attributes
    console.log(number);
    const readData = await fs.readFileSync('./output/uneditedMetadata/' + number.toString(), 'utf-8');
    const obj = await JSON.parse(readData);
    const attributes = obj.attributes;
    console.log(attributes);
    // --- composositon loop
    // get template
    let image = await jimp.read('./input/layers/template.png');
    // for i in attributes; composite images          (when layer ordering, just go for i in layerOrder;)
    for (let index = 0; index < layerOrder.length; index++) {
      // read image
      const comp = await jimp.read('./input/layers/' +     attributes[layerOrder[index]]['trait_type']+'/'     +attributes[layerOrder[index]]['value']+'.png');
      //composite image
      await image.composite(comp, 0,0, [{}]);
    }
    // --- write images
    await image.write('output/'       +'imageOutput/'   +count.toString()+'.png');
    // --- iterate loop
    console.log("--- end process");
    count++;
    if(count < maxCount){
     await MakeImage(count);
    }
  }
  MakeImage(count);
}
function editMetadatas(table){
  // --- change to sentence function
  const ChangeToSentence = function(string){
    const text = string;
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }
  // vars
  const ipfsStringHash = 'ipfs://QmS3ucPnUw8DLnS3K6qzNgKZuEtYSUyJBKLEaguBWbEGJa/';
  const projectHomepage = 'https://agents-in-the-dark.github.io/in-the-dark/';
  const maxCount = (()=>{const i = new TableIndex(table); return i.getMaxNumber()})();
  // --- metadata editing loop
  for (let index = 0; index < maxCount ; index++) {
    // --- read json
    const indexString = index.toString();
    const dataPath = './output/uneditedMetadata/' + indexString.toString();
    let obj;
    const readData = fs.readFileSync(dataPath, 'utf-8')
    obj=JSON.parse(readData);
    // --- edit json
    // image url
    obj.image = ipfsStringHash + indexString + '.png';
    // project home page
    obj.external_url = projectHomepage;
    // change to full sentence
    obj['attributes'].forEach((o)=>{
      o['trait_type'] = ChangeToSentence(o['trait_type']);
      o['value'] = ChangeToSentence(o['value']);
    });
    
    // write file
    console.log(obj);
    fs.writeFileSync('./output/metadataOutput/' +index.toString(), JSON.stringify(obj));
  }
}

// --- --- --- execution
// --- create table
const tableOfTraitsAndVariations = createTable('./input/nftData.csv');
console.log(tableOfTraitsAndVariations);

// --- write metadtas
// const templateObj = {
//  description: "This is kewl",
//  name: "Shapes Letters And Numbers",
//  image: "{ipfs hash}/",
//  external_url:"{projectHomepage}",
//  attributes: []
// }
// writeMetadatas(tableOfTraitsAndVariations, templateObj);

// --- generate images
const layerOrder = [2, 0, 1];
generateImages(tableOfTraitsAndVariations, layerOrder);

// --- editMetadatas
// editMetadatas(tableOfTraitsAndVariations);


