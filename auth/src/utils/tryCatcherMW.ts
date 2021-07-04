import express, { NextFunction } from 'express';

require('express-async-errors');

const tryCatcher = async function reusableTryCatchAsyncMiddleWare(callback: any) {
  try {
    await callback();
  } catch (err) {
    console.log(`caught u! err === ${err}`);
    console.error(err);
  }
};

export default tryCatcher;
