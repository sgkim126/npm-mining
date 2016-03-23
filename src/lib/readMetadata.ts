import * as fs from 'fs';
import IProject from './iproject';
import IUpdated from './iupdated';
import splitMetadata from './splitMetadata.ts';

export default function readMetadata(filename: string): Promise<[number, Map<string, IProject[]>]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (err: Error, data: string): void => {
      if (err) {
        reject(err);
        return;
      }

      const projects: IUpdated & { [key: string]: IProject } = JSON.parse(data);
      const [updated, map] = splitMetadata(projects);
      resolve([updated, map]);
    });
  });
}
