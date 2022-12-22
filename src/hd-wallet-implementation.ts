import * as crypto from "crypto-js";
var hexToBinary = require('hex-to-binary');
import WordList from "./wordlist";

function generateRandomBytes() {
  // Generate 32 bytes of entropy
  const entropyHex = crypto.lib.WordArray.random(16)
  // const entropy_utf8 = crypto.enc.Utf8.parse(entropy.toString())
  let entropy: string = hexToBinary(entropyHex.toString());

  const entropyHash: string = hexToBinary(crypto.SHA256(entropy).toString()).toString();
  // const test = parseInt(entropyHex.toString())
  // console.log(entropyHash);

  const checksumDigits: string = entropyHash.slice(0,4);
  // console.log(checksumDigits); 
  entropy = entropy + checksumDigits;
  // console.log(entropy.length);
  console.log(entropy);

  let counter: number = 0;
  const elevenBitsArray: string[] = [] // array of 32 bits strings
  while (counter < entropy.length/11) {
    const startIndex: number = counter*11
    const endIndex: number = startIndex + 11;
    const value: string = entropy.slice(startIndex,endIndex);
    elevenBitsArray.push(value);
    counter++;
  }

  console.log(elevenBitsArray);

  const mnemonicArray: string[] = []
  for (const elevenBits of elevenBitsArray) {
    const index: number = parseInt(elevenBits, 2);
    // console.log(`elevenBits are ${elevenBits}`)
    // console.log(`index is ${index}`);
    mnemonicArray.push(WordList[index]);
  }
  console.log(mnemonicArray);

  const password = mnemonicArray.join(" ");
  const salt = "mnemonic" // what is passphrase?
  const iterations = 2048;
  const keySize = 16; // 512/32
  const key = crypto.PBKDF2(password, salt, { keySize: keySize, iterations: iterations });

  console.log(key.toString(), "KEY");
}

generateRandomBytes();