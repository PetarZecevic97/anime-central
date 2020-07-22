const KitsuAPIWrapper = require("./kitsu_wrapper");
const api = new KitsuAPIWrapper();
const { exit } = require('process');
const insertAnime = require("./insert_anime");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

function fetchAnime(id){
    console.log("Fetching anime...")
    api.getAnimeById(id)
            .then(res => {
                return api.getGenres(res)})
            .then(res => {return api.getCategories(res)})
            .then(res => {return api.getProductionIds(res)})
            .then(res => {
                
                let genres = res.genreList.concat(res.categoryList)
                genres = genres.map(genre => genre.toLowerCase()).filter((value, index, self) => self.indexOf(value) === index)
                res.producerList = res.producerList.map(producer => producer.toLowerCase()).filter((value, index, self) => self.indexOf(value) === index)
                res.licencorList = res.licencorList.map(licencor => licencor.toLowerCase()).filter((value, index, self) => self.indexOf(value) === index)
                res.studioList = res.studioList.map(studio => studio.toLowerCase()).filter((value, index, self) => self.indexOf(value) === index)
                const anime = {
                    title : res.attributes.canonicalTitle,
                    synopsis : res.attributes.synopsis,
                    image_url : res.attributes.posterImage.original,
                    airedFrom : res.attributes.startDate,
                    genres : genres,
                    studios : res.studioList,
                    licencors : res.licencorList,
                    producers : res.producerList,
                }
                return Promise.resolve(anime)
            })
            .then(res => {return insertAnime.insert(res)})
            .then(res => {enterId()})
}

function enterId(){
    readline.question(`Enter id:`, (id) => {
        if(Number(id) === -1){
            enterPattern()
            return
        }
        fetchAnime(id)
    })
}

async function searchByPattern(pattern){
    const listOfAnime = await api.getAnimesByPattern(pattern)
    listOfAnime.forEach(anime => console.log(anime.id, ": ", anime.attributes.canonicalTitle))
    enterId()
    enterPattern()
}

function enterPattern(){
    readline.question(`Enter pattern:`, (pattern) => {
        if(Number(pattern) === -1){
            console.log("Goodbye!")
            process.exit()
        }
        searchByPattern(pattern);
    })
}

async function start(){
    await insertAnime.beginConnection()
    enterPattern()
}

start()