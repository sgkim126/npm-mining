import * as fs from 'fs'
import * as path from 'path'
import IProject from './iproject'
import newPromise from './newPromise.ts'

export default function saveMetadata(dirname: string, map: Map<string, IProject[]>, updated: number): Promise<any> {
  return newPromise(fs.exists, fs, dirname)
  .then((exists) => {
    if (exists) {
      throw new Error(`${dirname} already exists.`);
    }
    return newPromise(fs.mkdir, fs, dirname);
  }).then(() => {
    const waits: Promise<any>[] = [];
    for (const [name, projects] of map.entries()) {
      const filename = path.join(dirname, `${name}.json`);
      waits.push(writeFile(filename, projects));
    }
    return Promise.all(waits);
  }).then(() => {
    return writeUpdated(dirname, updated)
  });
}

function writeUpdated(dirname: string, updated: number): Promise<any> {
  // metadata.json file name does not conflicts, because another files have two
  // length name.
  return newPromise(fs.writeFile, fs, path.join(dirname, 'updated.json'), updated.toString(), 'utf-8');
}

function writeFile(filename: string, projects: IProject[]): Promise<any> {
  return newPromise(fs.writeFile, fs, JSON.stringify(projects), 'utf-8');
}
