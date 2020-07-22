const req = require('request');
const rp = require('request-promise');

class KitsuAPIWrapper {

    constructor(){

        this.request = req.defaults({            
            "headers": {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            }
        });

        this.baseUrl = 'https://kitsu.io/api/edge/'
    }

    async getAnimesByPattern(pattern){
        const url = this.baseUrl + 'anime';
        const querry = { 'filter[text]': pattern, 'include' : 'genres,categories', 'page[limit]' : 20};
        return new Promise((resolve, reject) => {
            
            this.request.get({ uri : url, qs : querry}, (err, res, body) => {

                if(err){
                    return reject(err);
                }else{
                    return resolve(JSON.parse(body).data);
                }

                
            });
        });
    }

    getAnimeById(id){

        let url = this.baseUrl + 'anime/' + id;


        return new Promise((resolve, reject) => {
            
            this.request.get({ uri : url}, (err, res, body) => {

                if(err){
                    return reject(err);
                }else{
                    return resolve(JSON.parse(body).data);
                }
             
            });
        });

    }

    getGenres(animeObj){
        
        let url = animeObj.relationships.genres.links.related;

        return new Promise((resolve, reject) => {
            
            this.request.get({ uri : url}, (err, res, body) => {

                if(err){
                    return reject(err);
                }else{
                    
                    let data = JSON.parse(body).data;
                    let genreList = data.map(genre => {return genre.attributes.name});
                    
                    animeObj.genreList = genreList;

                    return resolve(animeObj);
                }
                
            });
        });
    }

    getCategories(animeObj){

        let url = animeObj.relationships.categories.links.related;

        return new Promise((resolve, reject) => {
            
            this.request.get({ uri : url}, (err, res, body) => {
                if(err){
                    return reject(err);
                }else{
                    
                    let data = JSON.parse(body).data;
                    let categoryList = data.map(category => {return category.attributes.title});

                    animeObj.categoryList = categoryList;

                    return resolve(animeObj);
                }
                
            });
        });
    }

    async getProductionIds(animeObj){
        
        let url = animeObj.relationships.animeProductions.links.related;
        let options = {
            method : 'GET',
            uri : url,
            qs : {'page[limit]' : 20}
        }
        let body = undefined
        try {
            body = await rp(options)
        } catch(err) {
            console.log(err)
        }
        let data = JSON.parse(body).data;
        animeObj.studioList = []
        animeObj.producerList = []
        animeObj.licencorList = []
        let innerOptions = {
            method: 'GET',
        }
        for (let element of data){
            innerOptions.uri = element.relationships.producer.links.related
            let innerBody = undefined
            try {
                innerBody = await rp(innerOptions)
            } catch(err){
                console.log(err)
            }
            let innerData = JSON.parse(innerBody).data;
            let name = innerData.attributes.name
            if (element.attributes.role === "studio"){
                animeObj.studioList.push(name)
            } else if (element.attributes.role === "licensor"){
                animeObj.licencorList.push(name)
            } else if (element.attributes.role === "producer"){
                animeObj.producerList.push(name)
            }
        }
        return Promise.resolve(animeObj)
    }

    getAnimeInformation(id){
    

        if (!isNaN(id)){
            this.getAnime(id)
            .then(res => {
                return this.getGenres(res)})
            .then(res => {return this.getCategories(res)})
            .then(res => {return this.getProductionIds(res)})
            .then(res => {
                
                const genres = res.genreList
                genres.append(categoryList)
                console.log(genres)
                const anime = {
                    title : res.attributes.titles.en,
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
        }
    }
}

module.exports = KitsuAPIWrapper;