export default class Transfers {
  static baseUrl = 'https://volga24bot.com/kartoteka/api/tech/transfers/';


  static async create(type, content) {
    const url = `create.php?type=${type}&content=${content}&createAt=${new Date().toISOString().slice(0, 19).replace('T', ' ')}`;
    const response = await fetch(`${this.baseUrl}${url}`)
      .then(response => response.json());

    if (response.result === false) console.error(response.error);
    return response;
  }
}