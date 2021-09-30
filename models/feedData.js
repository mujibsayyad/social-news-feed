const fs = require('fs');
const path = require('path');

module.exports = class FeedData {
  constructor(title, addedDate) {
    this.title = title;
    this.addedDate = addedDate;
  }

  save() {
    const p = path.join(path.dirname(__dirname, 'data', 'post.json'));

    fs.readFile(p, (err, postContent) => {
      console.log(postContent);
      let posts;
      if (!err) {
        posts = JSON.parse(postContent);
      }
      posts.push(this);

      fs.writeFile(p, JSON.stringify(posts), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll() {
    const p = path.join(path.dirname(__dirname, 'data', 'post.json'));

    fs.readFile(p, (err, postContent) => {
      if (err) {
        return [];
      }
      return JSON.parse(postContent);
    });
  }
};
