import CloudStorage, { ICloudStorage } from "../storage";
import Database, { IDatabase } from "../database";
import { auth } from '@/plugins/firebase';

export interface IPostService {
  storage: ICloudStorage;
  database: IDatabase;
  savePost: (
    title: string,
    content: string,
    author: string,
    authorEmail: string,
    thumb: File
  ) => Promise<void>;
};

class PostsService {
  storage;
  database;
  
  constructor () {
    this.storage = new CloudStorage('posts');
    this.database = new Database('posts');
  };

  async savePost (
    title: string,
    content: string,
    author: string,
    authorEmail: string,
    thumb: File,
  ) {
    const postKey = await this.database.push({
      title,
      content,
      author,
      author_email: authorEmail,
      thumbnail: null,
    });

    if (!postKey) {
      return;
    };

    const thumbURL = await this.storage.uploadFile(thumb, postKey);

    if (!thumbURL) {
      return;
    };

    await this.database.update({
      thumbnail: thumbURL
    }, postKey);
  };
};

export default PostsService;