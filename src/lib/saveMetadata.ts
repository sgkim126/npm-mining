import * as fs from 'fs'
import * as path from 'path'
import IProject from './iproject'

export default function saveMetadata(dirname: string, map: Map<string, IProject[]>, updated: number): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.exists(dirname, (exists: boolean) => {
      if (exists) {
        reject(new Error(`${dirname} already exists.`));
        return;
      }
      fs.mkdir(dirname, (err: Error) => {
        if (err) {
          reject(err);
          return;
        }

        const waits: Promise<any>[] = [];
        for (const [name, projects] of map.entries()) {
          const filename = path.join(dirname, `${name}.json`);
          waits.push(writeFile(filename, projects));
        }
        Promise.all(waits)
        .then(() => {
          return writeUpdated(dirname, updated)
        }).then(resolve, reject);
      });
    });
  });
}

function writeUpdated(dirname: string, updated: number): Promise<any> {
  return new Promise((resolve, reject) => {
    // metadata.json file name does not conflicts, because another files
    // have two length name.
    fs.writeFile(path.join(dirname, 'updated.json'), updated.toString(), 'utf-8', (err: Error) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function writeFile(filename: string, projects: IProject[]): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(projects), 'utf-8', (err: Error) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
