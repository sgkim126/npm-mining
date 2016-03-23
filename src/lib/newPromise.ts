export default function newPromise<P, This>(fn: Function, thisArg: This, ...args: any[]): Promise<P> {
  return new Promise((resolve, reject) => {
    args.push((err: any, result: P) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
    fn.apply(thisArg, args);
  });
}
