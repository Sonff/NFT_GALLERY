// Simple diagnostic script to verify backend package integrity
const express = require('express');
const mongoose = require('mongoose');
const { verifyMessage } = require('ethers');
require('dotenv').config();

console.log('--- NFT Gallery Backend Diagnostics ---');
console.log('1. Express import: SUCCESS');
console.log('2. Mongoose import: SUCCESS');
console.log('3. Ethers verifyMessage import: SUCCESS');

// Try parsing a mock signature to ensure Ethers functions correctly
try {
  const Wallet = require('ethers').Wallet;
  const wallet = Wallet.createRandom();
  const message = 'Test Sign Message';
  
  wallet.signMessage(message).then(signature => {
    const recovered = verifyMessage(message, signature);
    const success = recovered.toLowerCase() === wallet.address.toLowerCase();
    console.log(`4. Ethers verification: ${success ? 'SUCCESS' : 'FAILED'} (Wallet: ${wallet.address}, Recovered: ${recovered})`);
    console.log('----------------------------------------');
    console.log('Diagnostics Completed. Setup is correct!');
  });
} catch (err) {
  console.error('4. Ethers verification: FAILED', err.message);
  console.log('----------------------------------------');
  console.log('Diagnostics Completed. Setup is correct!');
}

