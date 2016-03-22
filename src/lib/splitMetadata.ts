import IProject from './iproject'
import IUpdated from './iupdated'

export default function splitMetadata(projects: IUpdated & { [key: string] : IProject }): [number, Map<string, IProject[]>] {
  const updated = projects._updated;

  const map = new Map<string, IProject[]>();
  for (const name in projects) {
    if(projects.hasOwnProperty(name)) {
      if (name === '_updated') {
        continue;
      }
      const key = name.substr(0, 2);
      const results = map.get(key) || [];
      results.push(projects[name]);
      map.set(key, results);
    }
  }

  return [updated, map];
}
