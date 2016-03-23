import * as assert from 'assert';
import newPromise from '../lib/newPromise.ts';

describe('#newPromise', () => {
  context('#successful callback', () => {
    function withoutArgument(callback: (err?: Error) => void): void {
      callback();
    };
    function withOneArgument<T>(value: T, callback: (err?: Error, value?: T) => void): void {
      callback(undefined, value);
    }
    function sumOfTwoArguments(value1: number, value2: number, callback: (err?: Error, value?: number) => void): void {
      callback(undefined, value1 + value2);
    }

    it('successful callback returns successful promise', (done: MochaDone) => {
      return newPromise(withoutArgument, null).then(() => done(), done);
    });
    it('successful callback returns successful promise with value', (done: MochaDone) => {
      const SOME_VALUE = 1;
      return newPromise(withOneArgument, null, SOME_VALUE)
      .then((value) => assert.equal(value, SOME_VALUE))
      .then(() => done(), done);
    });
    it('successful callback returns successful promise with callback result', (done: MochaDone) => {
      const SOME_VALUE1 = 1;
      const SOME_VALUE2 = 5;
      return newPromise(sumOfTwoArguments, null, SOME_VALUE1, SOME_VALUE2)
      .then((value) => assert.equal(value, SOME_VALUE1 + SOME_VALUE2))
      .then(() => done(), done);
    });
  });

  context('#failed callback', () => {
    function fail(callback: (err?: Error) => void): void {
      callback(new Error());
    };
    function failWithReason(value: string, callback: (err?: Error, value?: string) => void): void {
      callback(new Error(value));
    }

    it('error callback returns failed promise', (done: MochaDone) => {
      return newPromise(fail, null)
      .then(() => { throw new Error('it should fail'); }, () => {})
      .then(() => done(), done);
    });
    it('error callback returns failed promise with reason', (done: MochaDone) => {
      const REASON = 'it must fail';
      return newPromise(failWithReason, null, REASON)
      .then(() => { throw new Error('it should fail'); }, (err: Error) => assert.equal(err.message, REASON))
      .then(() => done(), done);
    });
  });
});
