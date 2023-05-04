/* eslint-disable max-len */
const {Pool} = require('pg');
const CONFIG = require('../config');

const pool = new Pool({
  user: CONFIG.POSTGRES_USER,
  password: CONFIG.POSTGRES_PASS,
  host: CONFIG.POSTGRES_HOST,
  database: CONFIG.POSTGRES_DB,
  port: 5432,
});

const TABLE = CONFIG.POSTGRES_DB_TABLE;

const getArticles = async () => {

  try {
    const data = await pool.query(`SELECT * FROM ${TABLE} ORDER BY id ASC`);
    console.log(data);
    return data;

  } catch (err) {
    throw new Error(err);
  }
};


// const addArticle = () => {
//   const title = 'This is an article';
//   const content = `
//   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur nec tortor nec finibus. Nunc pulvinar, nisi rhoncus imperdiet scelerisque, lacus ex elementum nulla, et facilisis nisl ante a massa. Sed lacus lectus, dictum ut ex ac, suscipit posuere massa. Etiam placerat magna sed ultrices luctus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec id risus id eros dapibus rutrum eleifend a libero. Maecenas malesuada sem est, sit amet iaculis dui ultricies vel. Donec sagittis erat volutpat massa pretium, a consectetur nisi dictum. Mauris nibh justo, malesuada at pharetra sit amet, sagittis sit amet neque. Quisque iaculis enim eu odio porta pulvinar. Quisque semper nec enim non elementum. Curabitur dapibus lacus a sagittis commodo. Aenean purus ante, interdum vitae risus dictum, fermentum imperdiet sapien.
  
//   Mauris ac ullamcorper leo, nec imperdiet leo. Sed dignissim dui ac pharetra ullamcorper. Phasellus dignissim nunc vestibulum nisi vulputate lobortis. Mauris molestie gravida metus, vel fringilla orci faucibus eu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque at tellus volutpat, accumsan risus quis, bibendum lorem. Praesent aliquam ligula nec lacus laoreet, in porttitor sapien blandit.`;

//   const result = doQuery(
//       `INSERT INTO ${TABLE} (title, date_created, content) VALUES ($1, $2, $3) RETURNING *`,
//       [title, dateCreated, content]);
// };
