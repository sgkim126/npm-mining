import readMetadata from './lib/readMetadata.ts';
import saveMetadata from './lib/saveMetadata.ts';

(() => {
  const input_file: string = process.argv[2];
  const out_dir: string = process.argv[3];

  if (process.argv.length !== 4) {
    console.error('Usage :');
    console.error(`\tnode ${process.argv[1]} {input file name} {output directory}`);
    process.exit(-1);
  }

  readMetadata(input_file)
  .then(([updated, projects]: [number, Map<string, any>]): Promise<boolean> => {
    return saveMetadata(out_dir, projects, updated);
  }).then(() => {
    console.log(`Parsing ${input_file} is successfully finished.`);
    process.exit(0);
  }, (err: Error) => {
    console.log(`Parsing ${input_file} is failed. Because of`);
    console.error(`${err}`);
    process.exit(-1);
  });
})();
