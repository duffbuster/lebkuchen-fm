import Command, {
  CommandType,
  AddArgument,
} from '../domain/Command';
import Song from '../domain/Song';
import SongRepository from '../repositories/SongRepository';

function handleAdd(argument: AddArgument) : Promise<string> {
  const song: Song = {
    name: argument.name,
    youtubeId: argument.id,
    trimStartSeconds: argument.trimStartSeconds,
    trimEndSeconds: argument.trimEndSeconds,
    timesPlayed: 0,
  };

  return SongRepository
    .getByName(song.name)
    .then((foundSong) => {
      if (foundSong !== null) {
        return Promise.resolve(`Utwór o tytule "${song.name}" już jest w bazie`);
      }

      SongRepository.insert(song);
      return Promise.resolve(`Dodałem utwór "${song.name}" do biblioteki`);
    });
}

function handleList() : Promise<string> {
  return new Promise((resolve, reject) => {
    return SongRepository
      .getAll()
      .then((songs: Song[]) => {
        const message = songs
          .map(song => `YT: ${song.youtubeId}, ${song.name}, ${song.timesPlayed} odtworzeń`)
          .join('\n');

        resolve(message);
      })
      .catch(reject);
  });
}

function execute(command: (Command | null)) : Promise<string> {
  if (!command) return Promise.resolve('');

  switch (command.type) {
    case CommandType.Add:
      return handleAdd(command.arguments as AddArgument);
    case CommandType.List:
      return handleList();
    default:
      return Promise.resolve('');
  }
}

export default {
  execute,
};
